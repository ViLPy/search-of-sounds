/** @type {CanvasRenderingContext2D} */
let hudCtx;

function hudInit() {
    const canvas = document.getElementById('hud');
    hudCtx = canvas.getContext('2d');
}

function hudClear() {
    hudCtx.clearRect(0, 0, WIDTH, HEIGHT);
}

function hudSetFont(size, bold = false) {
    hudCtx.font = `${(bold) ? 'bold ' : ''}${size}px palatino,serif`;
}

function hudWrite(x, y, text, stroke = false) {
    hudCtx.fillText(text, x, y);
    if (stroke) {
        hudCtx.strokeText(text, x, y);
    }
}

function hudStrokeStyle(style) {
    hudCtx.strokeStyle = style;
}

function hudFillStyle(style) {
    hudCtx.fillStyle = style;
}

function hudRenderTitle() {
    hudCtx.lineWidth = 0.3;
    hudStrokeStyle('#ffe891');
    hudFillStyle('#e5bf4c');

    hudSetFont(64, true);
    const text2 = 'Search of Sounds';
    const text2Width = getHudTextWidth(text2);
    hudWrite(WIDTH / 2 - text2Width / 2, 110, text2, true);
}

function hudNewGame(selected = false) {
    hudFillStyle(selected ? '#ff2020' : '#f0f0f0');
    hudWrite(60, HEIGHT - 100, 'New Game');
}


function hudSettings(selected = false) {
    const QualityLevels = ['Low', 'Mid', 'High'];
    hudFillStyle(selected ? '#ff2020' : '#f0f0f0');
    hudWrite(400, HEIGHT - 100, 'Graphics - ' + QualityLevels[gfxQuality - 1]);
}

function hudRenderMenu(state = 0) {
    hudClear();
    hudRenderTitle();

    hudSetFont(26, true);
    hudNewGame(state === 0);
    hudSettings(state === 1);
}

/** @typedef {{a: number, b: number, c: number}} */
let AudioGameState;

/**
 *
 * @param {AudioGameState} state
 */
function hudRenderGame(state) {
    hudClear();

    // gems
    hudRenderGem(100, 250, [255, 0, 0], state.a, -Math.PI / 2);
    hudRenderGem(WIDTH / 2, 223, [250, 250, 0], state.b, 0);
    hudRenderGem(WIDTH - 100, 250, [20, 255, 20], state.c, Math.PI / 2);
}

function hudGemRenderColor(baseColor, intensity) {
    hudFillStyle(`rgb(${0 | baseColor[0] * intensity},${0 | baseColor[1] * intensity},${0 | baseColor[2] * intensity})`);
}

function getHudTextWidth(text) {
    return hudCtx.measureText(text).width;
}

function hudRenderGem(x, y, baseColor, intensity, angle) {
    intensity = Math.min(Math.max(0.3, intensity), 1);
    hudCtx.save();

    hudCtx.translate(x, y);
    hudCtx.rotate(angle);

    hudGemRenderColor(baseColor, intensity * 0.9);
    hudCtx.beginPath();
    hudCtx.moveTo(0, -15);
    hudCtx.lineTo(0, 30);
    hudCtx.lineTo(-45, 75);
    hudCtx.fill();

    hudGemRenderColor(baseColor, intensity * 0.8);
    hudCtx.beginPath();
    hudCtx.moveTo(0, -15);
    hudCtx.lineTo(0, 30);
    hudCtx.lineTo(45, 75);
    hudCtx.fill();

    hudGemRenderColor(baseColor, intensity * 0.7);
    hudCtx.beginPath();
    hudCtx.moveTo(0, 30);
    hudCtx.lineTo(-45, 75);
    hudCtx.lineTo(45, 75);
    hudCtx.fill();

    hudGemRenderColor(baseColor, intensity);
    hudCtx.beginPath();
    hudCtx.moveTo(0, 0);
    hudCtx.lineTo(30, 60);
    hudCtx.lineTo(-30, 60);
    hudCtx.fill();

    hudCtx.restore();
}