class RhythmPlayer {
    constructor(beats, interval, playCallback, loop = false, shuffle = false, onEnd = undefined) {
        this.beats = beats;
        this.interval = interval / 1000;
        this.playCallback = playCallback;
        this.onEnd = onEnd;
        this.loop = loop;
        this.isPlaying = false;
        this.shuffle = shuffle;

        this.time = 0;
        this.lastPlayedFrame = -1;
        this.totalTime = 0;
        this.initTime();
    }

    initTime() {
        this.totalTime = this.beats.length * this.interval;
    }

    getCurrentFrame() {
        return ~~(this.time / this.interval);
    }

    play() {
        this.initTime();
        this.isPlaying = true;
        this.time = 0;
    }

    update(dt) {
        if (!this.isPlaying) {
            return;
        }

        this.time += dt;
        const frame = this.getCurrentFrame();
        if (this.lastPlayedFrame === frame) {
            return;
        }
        const isEnded = this.time > this.totalTime;
        if (isEnded && !this.loop) {
            this.onEnd && this.onEnd();
            this.lastPlayedFrame = -1;
            this.isPlaying = false;
            return;
        }
        if (isEnded && this.loop) {
            const timeWithinLoop = this.time % this.totalTime;
            this.time = ~~(timeWithinLoop / this.interval);

        }
        if (isEnded && this.loop && this.shuffle) {
            shuffle(this.beats);
        }

        this.lastPlayedFrame = frame;
        this.playCallback(this.beats[frame]);
    }
}