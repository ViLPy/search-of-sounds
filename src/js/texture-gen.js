/** @dict */
let globalTextures = {};

function createCanvas(w, h) {
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
}

function genTextures() {
    genCanvas();
    genLightHouseTexture();
    genPillarTexture();
    genHouseTexture();
}

function addNoise(ctx, base = 100, width = 128, height = 256) {
    for (let i = 0; i < 16; i++) {
        const intensity = 0 | Math.random() * 60 + base;
        ctx.fillStyle = `rgb(${intensity},${intensity},${intensity})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 100 + 20, Math.random() * 20 + 10);
    }
}

function genLightHouseTexture() {
    let canvas = createCanvas(128, 256);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#dcdcdc';
    ctx.fillRect(0, 0, 128, 256);

    addNoise(ctx, 150);

    ctx.fillStyle = '#c80000';
    ctx.fillRect(0, 40, 128, 40);

    globalTextures['l'] = loadTexture(canvas, true);
}

function genPillarTexture() {
    let canvas = createCanvas(128, 256);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#dcdcdc';
    ctx.fillRect(0, 0, 128, 256);

    addNoise(ctx);

    globalTextures['plr'] = loadTexture(canvas, true);
}


function genHouseTexture() {
    let canvas = createCanvas(256, 64);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#dcdcdc';
    ctx.fillRect(0, 0, 256, 64);
    addNoise(ctx, 150, 256, 64);

    ctx.fillStyle = '#05b';
    for (let i = 3; i--;) {
        ctx.fillRect(i * 64 + 32 - 12, 32 - 12, 24, 24);
    }

    globalTextures['hs'] = loadTexture(canvas, true);
}

function genCanvas() {
    const permutations = getPerlinPermutations();
    const scales = [8, 2];
    for (let t = 0; t < scales.length; t++) {
        let canvas = createCanvas(512, 512);
        let ctx = canvas.getContext('2d');
        let z = Math.random() * 32;
        for (let x = 0; x < 512; x++) {
            for (let y = 0; y < 512; y++) {
                let scale = scales[t];
                let value = ~~(PerlinNoise(x / scale, y / scale, z, 512 / scale, 512 / scale, 256, permutations) * 256);
                ctx.fillStyle = `rgb(${value},${value},${value})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
        globalTextures['p' + t] = loadTexture(canvas, false);
    }
}