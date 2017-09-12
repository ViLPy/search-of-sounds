const AC = (window.AudioContext) ? AudioContext : webkitAudioContext;

AC.prototype.createBrownNoise = function (bufferSize = 4096) {
    let lastOut = 0.0;
    const node = this.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = function (e) {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }
    };
    return node;
};

const bgAudioContext = new AC();

function startNoise() {
    let noiseT = 0, noiseT2 = Math.PI / 2;
    const brownGain = bgAudioContext.createGain();

    function updateGain() {
        const a = 0.02 * Math.abs(Math.sin(noiseT));
        const b = 0.01 * Math.abs(Math.sin(noiseT2));

        brownGain.gain.value = Math.max(a, b, 0.005);
        noiseT += Math.random() * 0.05;
        noiseT2 += Math.random() * 0.05;
    }

    try {
        const brownNoise = bgAudioContext.createBrownNoise();
        brownGain.gain.value = 0.02;
        brownNoise.connect(brownGain);
        brownGain.connect(bgAudioContext.destination);
    } catch (e) {
        // just in case of createScriptProcessor errors
    }

    setInterval(updateGain, 100);
}

const notes = [140, 143, 147, 148, 150, 152, 155];
const delays = [5, 7, 11, 13, 17, 19, 23, 29];
const tones = [-12, 0];

/** @dict */
let buffers = {};

function playBuffer(ctx, id, gain = 1) {
    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;
    let source = ctx.createBufferSource();
    source.buffer = buffers[id];
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
}

function preloadAudio() {
    // closure compiler Promise polyfill overrides :(
    // preload pads
    const soundGenPads = new sonantx.SoundGenerator(padsInstrument);
    const pads = notes.map((note) => {
        return tones.map((tone) => {
            return new window['Promise']((resolve) => {
                soundGenPads.getAudioGenerator(note + tone, function (audioGenerator) {
                    audioGenerator.getAudioBuffer((buffer) => {
                        buffers['p' + (note + tone)] = buffer;
                        resolve();
                    });
                });
            });
        });
    });
    // preload bell
    const soundGenBell = new sonantx.SoundGenerator(bellInstrument);
    const bells = [128, 130, 132].map((tone, index) => {
        new window['Promise']((resolve) => {
            soundGenBell.getAudioGenerator(tone, function (audioGenerator) {
                audioGenerator.getAudioBuffer((buffer) => {
                    buffers['b' + index] = buffer;
                    resolve();
                });
            });
        });
    });

    const soundGenMorse = new sonantx.SoundGenerator(morseInstrument);
    const morse = new window['Promise']((resolve) => {
        soundGenMorse.getAudioGenerator(140, function (audioGenerator) {
            audioGenerator.getAudioBuffer((buffer) => {
                buffers['m'] = buffer;
                resolve();
            });
        });
    });

    return window['Promise'].all(pads.concat(bells, morse));
}

function playBackground() {
    document.getElementById('mdl').style.opacity = 0;
    startNoise();

    function schedulePlay(tone, note, index) {
        setTimeout(() => {
            if (currentTonality === tone) {
                playBuffer(bgAudioContext, 'p' + (note + tone));
            }
            schedulePlay(tone, note, index);
        }, delays[index] * 1000);
    }

    let currentTonality = 0;
    setInterval(() => {
        shuffle(delays);
        const f = Math.random();
        currentTonality = (f < 0.5) ? tones[0] : tones[1];
    }, 30000);

    notes.forEach((note, index) => {
        tones.forEach((tone) => {
            schedulePlay(tone, note, index);
        });
    });
}