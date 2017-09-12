const WATER_SIZE = 190;

/** @dict */
let waterUniforms = {
    'time': {value: 10.0, type: Uniform.FLOAT},
    'light': {value: [0, 0, 0.1], type: Uniform.VEC3},
    'deltaP': {value: [0, 0], type: Uniform.VEC2},
    'waves': {value: getWaves(), type: Uniform.FLOAT_ARRAY}
};

function getWaves() {
    const size = 24;
    const structSize = 6;
    let waves = [];
    for (let i = 0; i < size; i++) {
        waves[i * structSize] = 3 + Math.random() * 31; // wavelength
        waves[i * structSize + 1] = Math.random() * 0.9; // steepness
        waves[i * structSize + 2] = Math.random() * 0.02; // kAmpOverLen
        waves[i * structSize + 3] = Math.random(); // speed
        let normDirection = [Math.random() * 0.5, Math.random() * 2 - 1, 0];
        normalizeVec3(normDirection, normDirection);
        waves[i * structSize + 4] = normDirection[0]; // wave_dir.x
        waves[i * structSize + 5] = normDirection[1]; // wave_dir.y
    }
    return waves;
}

function createOcean() {
    const plane = getPlaneGeometry(WATER_SIZE, WATER_SIZE, 20, 20);
    /** @dict */
    const planeAttributes = {
        'anchor': {
            value: plane.anchors,
            size: 2
        },
        'vp': {
            value: plane.vertices,
            size: 3
        }
    };
    waterUniforms = Object.assign(waterUniforms, {
        'light': {value: [SUN_X, SUN_Y, SUN_Z], type: Uniform.VEC3},
        'sampler': {value: globalTextures['p1'], type: Uniform.TEX, textureId: 0},
        'sampler2': {value: globalTextures['p1'], type: Uniform.TEX, textureId: 1}
    });
    const ocean = new Mesh(planeAttributes, plane.indices, oceanShader);
    ocean.setUniformsData(waterUniforms);

    return ocean;
}