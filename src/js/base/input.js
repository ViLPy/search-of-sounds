/** @enum */
const KeyCodes = {
    ACTION: 0x41,
    LEFT: 0x25,
    RIGHT: 0x27,
    UP: 0x26
};

class Input {
    constructor() {
        this.keysState = {};

        this.doKeyPress = this.doKeyPress.bind(this);
        this.doKeyUp = this.doKeyUp.bind(this);
        document.body.addEventListener('keydown', this.doKeyPress, false);
        document.body.addEventListener('keyup', this.doKeyUp, false);
    }

    press(key) {
        this.keysState[key] = 1;
    }

    reset(key) {
        this.keysState[key] = 0;
    }

    resetAll() {
        Object.keys(this.keysState).forEach((key) => {
            this.keysState[key] = 0;
        });
    }

    isPressed(key) {
        return this.keysState[key] === 1;
    }

    doKeyPress(evt) {
        let key = evt.keyCode;
        this.press(key);
    }

    doKeyUp(evt) {
        let key = evt.keyCode;
        this.reset(key);
    }
}

/** @type {Input} */
let InputManager = new Input();