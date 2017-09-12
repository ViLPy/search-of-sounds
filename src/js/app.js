/** @type {WebGLRenderingContext} */
let gl;

function init() {
    const canvas = document.getElementById('app');
    gl = initWebGL(canvas);

    hudInit();
    genTextures();
    buildShaders();
    preloadAudio().then(start);
}

function start() {
    playBackground();
    let game = new Game();
    game.setup();

    requestAnimationFrame(raf);

    function raf(dt) {
        requestAnimationFrame(raf);
        game.render(dt);
    }
}

function initWebGL(canvas) {
    if (gfxQuality === 1) {
        canvas.width = 320;
        canvas.height = 240;
    }
    // Try to grab the standard context. If it fails, fallback to experimental.
    const params = {antialias: gfxQuality === 3, alpha: false};
    let gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('You`re lost w/o WebGL');
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);

    return gl;
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 100);
});
