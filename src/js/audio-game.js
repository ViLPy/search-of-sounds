class AudioGame {
    constructor(onFinish, maxNotes, interval = 500) {
        this.onFinish = onFinish;
        this.maxNotes = maxNotes;
        this.userNotes = [];
        this.futureNotes = [];
        this.waitingForUser = false;

        this.delayBeforeStart = 1;
        this.isStarted = false;
        this.isEnded = false;

        /** @type {AudioGameState} */
        this.state = {a: 0, b: 0, c: 0};

        // prepare whole melody
        this.futureNotes = [];
        for (let i = maxNotes; i--;) {
            this.futureNotes.push(i % 3 + 1);
        }
        shuffle(this.futureNotes);
        this.notes = [this.futureNotes[0]];

        // note players
        this.feedBackPlayer = new RhythmPlayer([1, 1], 200,
            () => playBuffer(bgAudioContext, 'm', 1)
        );

        /** @type {RhythmPlayer} */
        this.rhythmPlayer = new RhythmPlayer(this.notes, interval,
            this.onNote.bind(this),
            false, false,
            this.onRhythmEnd.bind(this));
    }

    onRhythmEnd() {
        if (this.isEnded) {
            this.onFinish();
        } else {
            this.waitingForUser = true;
        }
    }

    onNote(note) {
        const intensity = (this.isEnded) ? 5 : 1.1;
        if (note === 1) {
            playBuffer(bgAudioContext, 'b0', 1);
            this.state.a = intensity;
        } else if (note === 2) {
            playBuffer(bgAudioContext, 'b1', 1);
            this.state.b = intensity;
        } else if (note === 3) {
            playBuffer(bgAudioContext, 'b2', 1);
            this.state.c = intensity;
        }
    }

    update(dt) {
        this.delayBeforeStart -= dt;
        if (!this.isStarted && this.delayBeforeStart < 0) {
            this.isStarted = true;
            this.rhythmPlayer.play();
        }
        this.state.a -= dt;
        this.state.b -= dt;
        this.state.c -= dt;

        this.rhythmPlayer.update(dt);
        this.feedBackPlayer.update(dt);

    }

    refresh(gen = true) {
        if (gen) {
            this.notes.push(this.futureNotes[this.notes.length]);
        }
        this.userNotes = [];
        this.isStarted = false;
        this.waitingForUser = false;
        this.delayBeforeStart = 1;
    }

    recordNote(note) {
        if (!this.waitingForUser) {
            // input blocked
            return;
        }

        if (this.notes[this.userNotes.length] !== note) {
            // failed to reproduce
            this.feedBackPlayer.play();
            this.refresh(false);
        } else {
            // reproduced one note correctly
            this.userNotes.push(note);
            this.onNote(note);
            if (this.userNotes.length === this.notes.length) {
                // if played whole melody
                if (this.notes.length < this.maxNotes) {
                    // continue
                    this.refresh(true);
                } else {
                    // all done
                    this.isEnded = true;
                    this.refresh(false);
                    this.notes.length = 0;
                    for (let i = 4; i--;) this.notes[i] = i + 1;
                }
            }
        }
    }
}