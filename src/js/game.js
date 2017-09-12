class Game {
    constructor() {
        this.scene = new Scene();
        this.playerX = 0;
        this.playerZ = WORLD_HEIGHT + 20;
        this.shipAngle = -Math.PI / 4;
        this.velocity = 0;

        /**
         * @type {ShipObject|null}
         */
        this.ship = null;
        this.shipSwayPhase = [0, 0]; // ship swaying on waves phase
        this.ocean = undefined;

        this.state = AppState.INTRO;
        this.selectedMenuItem = 0;

        this.time = 0;
        this.distress = new RhythmPlayer(
            [1, 1, 1, , 1, , , 1, , , 1, , , 1, 1, 1, , ,], 200,
            this.playDistress.bind(this),
            true,
            true
        );
        this.distress.play();
        this.distressGain = 0;

        this.hudOpacity = 1;
        this.infoOpacity = 1;

        this.sailAngle = 1;
        this.lands = [];
        this.landsCoords = [];
        this.distressPositionIndex = 0;
        this.passedChallenges = 0;

        this.audioGame = undefined;

        this.flocks = [];
    }

    setup() {
        // common objects - water, ship, player
        this.ship = getShipObject();
        this.ship.shipGroup.scale = [0.5, 0.5, 0.5];
        this.scene.addCommonObject(this.ship.shipGroup);

        // location based
        this.landsCoords = createWorldMap();
        this.landsCoords.forEach((coords, index) => {
            coords[LAND_COORD_ID] = index; // store index to use it after we shuffle landsCoords
            const l1desc = buildLandDescription();
            const l1 = new Land(l1desc, [coords[0], 0, coords[1]]);
            this.lands.push(l1);
            this.scene.addObject(coords[0], coords[1], l1.getRenderable());
        });
        this.distressPositionIndex = 0;
        this.playerX = this.landsCoords[1][0];
        this.playerZ = this.landsCoords[1][1] + 70;
        shuffle(this.landsCoords);

        this.landsCoords.forEach((c) => {
            const birdFlock = flockCreate(AnimalType.BIRD, gfxQuality, c[0], 10, c[1], 1);
            birdFlock.forEach((obj) => this.scene.addObject(c[0], c[1], obj.mesh));
            this.flocks.push(birdFlock);
            const fishFlock = flockCreate(AnimalType.FISH, gfxQuality + 2, c[2], -0.5, c[3], 0.1);
            fishFlock.forEach((obj) => this.scene.addObject(c[2], c[3], obj.mesh));
            this.flocks.push(fishFlock);
        });

        // water is transparent, add last
        this.ocean = createOcean();
        this.scene.addCommonObject(this.ocean);
    }

    showInfo(text, force = false) {
        if (this.infoOpacity === 0 || force) {
            this.infoOpacity = 1;
            document.getElementById('inf').innerHTML = text;
            document.getElementById('inf').style.opacity = 1;
        }
    }

    hideInfo() {
        if (this.infoOpacity === 1) {
            this.infoOpacity = 0;
            document.getElementById('inf').style.opacity = 0;
        }
    }

    showHud() {
        if (this.hudOpacity === 0) {
            this.hudOpacity = 1;
            document.getElementById('hud').style.opacity = 1;
        }
    }

    hideHud() {
        if (this.hudOpacity === 1) {
            this.hudOpacity = 0;
            document.getElementById('hud').style.opacity = 0;
        }
    }

    playDistress(beat) {
        if (beat === 1) {
            playBuffer(bgAudioContext, 'm', this.distressGain);
        }
    }

    handleIntro() {
        if (InputManager.isPressed(KeyCodes.ACTION)) {
            this.state = AppState.MENU;
            this.hideInfo();
            InputManager.resetAll();
        }
    }

    handleDone() {
        this.showInfo(WIN_TEXT, true);
        if (InputManager.isPressed(KeyCodes.ACTION)) {
            this.state = AppState.SAIL;
            this.hideInfo();
            InputManager.resetAll();
        }
    }

    handleMenu() {
        if (InputManager.isPressed(KeyCodes.LEFT)) {
            this.selectedMenuItem = ++this.selectedMenuItem % 2;
            InputManager.resetAll();
        }
        if (InputManager.isPressed(KeyCodes.RIGHT)) {
            this.selectedMenuItem = (--this.selectedMenuItem + 2) % 2;
            InputManager.resetAll();
        }
        if (InputManager.isPressed(KeyCodes.ACTION)) {
            switch (this.selectedMenuItem) {
                case 0:
                    this.hideHud();
                    this.state = AppState.SAIL;
                    break;
                case 1:
                    this.showInfo(RESTART_SETTING_TEXT, true);
                    gfxQuality = gfxQuality % 3 + 1;
                    window.localStorage.setItem('q', gfxQuality + '');
                    break;
            }
            InputManager.resetAll();
        }
    }

    handleSailing(dt) {
        if (InputManager.isPressed(KeyCodes.LEFT)) {
            this.shipAngle += 0.01;
        }
        if (InputManager.isPressed(KeyCodes.RIGHT)) {
            this.shipAngle -= 0.01;
        }

        if (InputManager.isPressed(KeyCodes.UP)) {
            this.velocity = Math.min(this.velocity + 0.001, MAX_SHIP_VELOCITY);
        } else {
            this.velocity = Math.max(this.velocity - 0.002, 0);
        }

        let landed = false;
        let landedToDistress = false;
        this.landsCoords.forEach((coords, index) => {
            const landsIndex = coords[LAND_COORD_ID];
            const distance = lengthSq([this.playerX - coords[0], 0, this.playerZ - coords[1]]);
            if (distance < 2500) {
                const landX = this.playerX - coords[0] - Math.sin(this.shipAngle) * 2.5 + 50;
                const landY = this.playerZ - coords[1] - Math.cos(this.shipAngle) * 2.5 + 50;

                if (landX > 0 && landX < 100 && landY > 0 && landY < 100) {
                    const height = this.lands[landsIndex].heightMap[0 | landX / 2][0 | landY / 2];
                    if (height >= 0 || distance < 10) {
                        landed = true;
                        landedToDistress = index === this.distressPositionIndex;
                    }
                }
            }
        });

        if (landed) {
            this.velocity = 0;
            this.showInfo((landedToDistress) ? LAND_DISTRESS_TEXT : LAND_WRONG_ISLAND_TEXT);
        } else {
            this.hideInfo();
        }

        if (landed && landedToDistress && InputManager.isPressed(KeyCodes.ACTION)) {
            InputManager.resetAll();
            this.state = AppState.CHALLENGE;

            const notesToFill = 6 + this.passedChallenges;

            this.audioGame = new AudioGame(() => {
                this.state = AppState.SAIL;
                if (this.passedChallenges % this.landsCoords.length === this.landsCoords.length - 1) {
                    // passed nine
                    shuffle(this.landsCoords);
                    if (this.passedChallenges === this.landsCoords.length - 1) {
                        // passed first nine
                        this.state = AppState.DONE;
                    }
                }
                this.distressPositionIndex =
                    (this.distressPositionIndex + 1) % this.landsCoords.length;
                this.passedChallenges++;
                this.hideHud();
                this.hideInfo();
            }, notesToFill);
            this.showHud();
            this.showInfo(REPEAT_GAME_TEXT, true);
        }

        this.distress.update(dt);
    }

    handleChallenge(dt) {
        this.audioGame.update(dt);
        if (InputManager.isPressed(KeyCodes.LEFT)) {
            InputManager.resetAll();
            this.audioGame.recordNote(1);
        }
        if (InputManager.isPressed(KeyCodes.RIGHT)) {
            InputManager.resetAll();
            this.audioGame.recordNote(3);
        }
        if (InputManager.isPressed(KeyCodes.UP)) {
            InputManager.resetAll();
            this.audioGame.recordNote(2);
        }
        if (InputManager.isPressed(KeyCodes.ACTION)) {
            InputManager.resetAll();
            this.state = AppState.SAIL;
            this.hideInfo();
            this.hideHud();
        }
    }

    renderGame(dt) {
        const dpx = this.velocity * Math.sin(this.shipAngle);
        const dpy = this.velocity * Math.cos(this.shipAngle);
        this.playerX -= dpx;
        this.playerZ -= dpy;

        waterUniforms['deltaP'].value[0] = -this.playerX;
        waterUniforms['deltaP'].value[1] = -this.playerZ;
        waterUniforms['time'].value += 0.1;

        // Ship render related things
        this.ship.shipGroup.position[0] = this.playerX;
        this.ship.shipGroup.position[1] = -0.25;
        this.ship.shipGroup.position[2] = this.playerZ;

        this.shipSwayPhase[0] += Math.random() * 0.05;
        this.shipSwayPhase[1] += Math.random() * 0.05;

        const speedCoefficient = 1 - this.velocity / MAX_SHIP_VELOCITY;
        const shipAngleX = speedCoefficient * Math.sin(this.shipSwayPhase[0]) * Math.PI / 60;
        const shipAngleZ = speedCoefficient * Math.cos(this.shipSwayPhase[1]) * Math.PI / 60;
        this.ship.shipGroup.rotation = rotateMatrix(shipAngleX, this.shipAngle + Math.PI, shipAngleZ);

        const distressPosition = this.landsCoords[this.distressPositionIndex];
        // Distress signal
        const distressDistanceSq = lengthSq([
            distressPosition[0] - this.playerX,
            distressPosition[1] - this.playerZ,
            0
        ]);

        const angle = wrapAngle(this.shipAngle);
        const angleToDistress = wrapAngle(Math.atan2(this.playerX - distressPosition[0], this.playerZ - distressPosition[1]));

        const positionBasedGain = (1 - Math.min(distressDistanceSq / 8000, 1)) / 2;
        const angleBasedGain = (1 - Math.min(angleDifference(angle, angleToDistress), Math.PI / 2) / (Math.PI / 2)) / 5;
        this.distressGain = Math.max(positionBasedGain, angleBasedGain);

        // Sail position
        const inFirstArea = angle >= 0 && angle < Math.PI / 2;
        const inSecondArea = angle < 0 && angle > -Math.PI / 2;
        const inThirdArea = angle >= Math.PI / 2;
        const inFourthArea = angle <= -Math.PI / 2;
        if (inFirstArea || inFourthArea) {
            this.sailAngle = Math.min(1, this.sailAngle + dt * 3 * Math.random());
            this.ship.sail.rotation = rotateMatrix(0, this.sailAngle * Math.PI / 5, 0);
        } else if (inSecondArea || inThirdArea) {
            this.sailAngle = Math.max(-1, this.sailAngle - dt * 3 * Math.random());
            this.ship.sail.rotation = rotateMatrix(0, this.sailAngle * Math.PI / 5, 0);
        }

        this.scene.position[0] = -this.playerX;
        this.scene.position[1] = -21;
        this.scene.position[2] = -this.playerZ - 21;
        this.scene.renderScene(this.playerX, this.playerZ);
    }

    render(time = 0) {
        const newTime = time / 1000;
        const dt = newTime - this.time;
        this.time = newTime;

        this.flocks.forEach(f => flockAnimate(dt, f));

        this.renderGame(dt);
        switch (this.state) {
            case AppState.MENU:
                this.handleMenu();
                hudRenderMenu(this.selectedMenuItem);
                break;
            case AppState.INTRO:
                this.handleIntro();
                hudRenderMenu(this.selectedMenuItem);
                break;
            case AppState.SAIL:
                this.handleSailing(dt);
                break;
            case AppState.CHALLENGE:
                this.handleChallenge(dt);
                hudRenderGame(this.audioGame.state);
                break;
            case AppState.DONE:
                this.handleDone();
                break;
        }
    }
}