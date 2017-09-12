const gulp = require('gulp'),
    fs = require('fs'),
    concat = require('gulp-concat'),
    compiler = require('google-closure-compiler-js').gulp(),
    zip = require('gulp-zip'),
    replace = require('gulp-replace'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    checkFilesize = require('gulp-check-filesize');

const tokenizeGLSL = require('glsl-tokenizer/stream'),
    parseGLSL = require('glsl-parser/stream'),
    deparseGLSL = require('glsl-deparser'),
    minifyGLSL = require('glsl-min-stream');

gulp.task('glsl', function (cb) {
    let shaders = {};

    if (!fs.existsSync('./tmp')){
        fs.mkdirSync('./tmp');
    }

    Promise.all(
        fs.readdirSync('src/shaders/')
            .filter(file => file.endsWith('.glsl'))
            .map((file) => {
                return new Promise((resolve) => {
                    let shaderData = '';
                    fs.createReadStream('src/shaders/' + file)
                        .pipe(tokenizeGLSL())
                        .pipe(parseGLSL())
                        .pipe(minifyGLSL(['main']))
                        .pipe(deparseGLSL(false))
                        .on('data', (chunk) => {
                            shaderData += chunk;
                        })
                        .on('end', () => {
                            shaders[file.replace('.glsl', '')] = shaderData;
                            resolve();
                        });
                });
            })
    ).then(() => {
        fs.writeFileSync('./tmp/shaders.js', `let sLib = ${JSON.stringify(shaders)};`);
        cb();
    });
});

gulp.task('js', ['glsl'], function () {
    return gulp.src(['tmp/shaders.js', 'src/js/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('tmp/'));
});

gulp.task('optimize', ['js'], function () {
    return gulp.src('tmp/main.js')
        .pipe(compiler({
            compilationLevel: (process.env.NODE_ENV === 'production') ? 'ADVANCED' : 'WHITESPACE',
            warningLevel: 'VERBOSE',
            useTypesForOptimization: true,
            jsOutputFile: 'main.js'
        }))
        .pipe(replace(/(\s)?\\x3d(\s)?/gm, '=')) // omg, closure compiler
        .pipe(replace(/(\s)?\\x3c(\s)?/gm, '<'))
        .pipe(replace(/(\s)?\\x3e(\s)?/gm, '>'))
        .pipe(gulp.dest('tmp/'));
});

gulp.task('css', function () {
    return gulp.src('src/main.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('tmp/'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/**/*.js', ['default']);
    gulp.watch('src/**/*.glsl', ['default']);
    gulp.watch('src/**/*.css', ['default']);
    gulp.watch('src/**/*.html', ['default']);
});

gulp.task('ship', ['optimize', 'css'], function () {
    return gulp.src(['src/index.html'])
        .pipe(replace('<style/>', `<style>${fs.readFileSync('./tmp/main.css')}</style>`))
        .pipe(replace('<script/>', `<script>${fs.readFileSync('./tmp/main.js')}</script>`))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('docs'));
});

gulp.task('zip', ['ship'], function () {
    return gulp.src(['docs/**/*.*'])
        .pipe(zip('submission.zip'))
        .pipe(gulp.dest(''));
});

gulp.task('check-size', ['zip'], function () {
    return gulp.src('submission.zip')
        .pipe(checkFilesize({
            fileSizeLimit: 13312 // 13312 === 13kb
        }));
});

gulp.task('default', ['check-size']);
