/** @enum {number} */
const Uniform = {
    FLOAT: 1,
    FLOAT_ARRAY: 2,
    VEC2: 3,
    VEC3: 4,
    M4X4: 5,
    TEX: 6
};

/** @enum {number} */
const AppState = {
    INTRO: 1,
    MENU: 2,
    SAIL: 3,
    CHALLENGE: 4,
    DONE: 5
};

/** @enum {number} */
const AnimalType = {
    BIRD: 1,
    FISH: 2
};

const CLUSTER_AMOUNT = 6;
const WORLD_WIDTH = 700;
const WORLD_HEIGHT = 700;
const CLUSTER_WIDTH = WORLD_WIDTH / CLUSTER_AMOUNT;
const CLUSTER_HEIGHT = WORLD_HEIGHT / CLUSTER_AMOUNT;

const WIDTH = 640;
const HEIGHT = 480;

const SUN_X = -270;
const SUN_Y = 450;
const SUN_Z = 850;

const MAX_SHIP_VELOCITY = 0.2;

let gfxQuality = +window.localStorage.getItem('q') || 3;

// texts
const WIN_TEXT = 'You did it! All nine stations are stable now!<br><br>Press [A] to proceed with your journey';
const RESTART_SETTING_TEXT = 'Restart to apply new settings';
const LAND_DISTRESS_TEXT = 'Press [A] to anchor and stabilize energy levels';
const LAND_WRONG_ISLAND_TEXT = 'Seems that signal comes from different place';
const REPEAT_GAME_TEXT = 'Repeat pattern with cursor keys. Press [A] to abort';

// no time to explain
const LAND_COORD_ID = 7;