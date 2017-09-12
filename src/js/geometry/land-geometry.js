/**
 * 2d gaussian function
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} sx
 * @param {number} sy
 * @param {number} amp
 * @return {number}
 */
function gausian(x, y, width, height, sx = 1, sy = 1, amp = 1) {
    const side = 3.2;
    const x1 = x / (width / (2 * side)) - side;
    const y1 = y / (height / (2 * side)) - side;
    const s1 = 2 * sx * sx;
    const s2 = 2 * sy * sy;
    return amp * Math.exp(-(x1 * x1 / s1 + y1 * y1 / s2));
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {Array<number>} permutations
 * @return {number}
 */
function getHeight(x, y, z, permutations) {
    let h = 0;
    const scales = [128, 64, 32, 8, 2];
    for (let j = 0; j < 5; j++) {
        h += PerlinNoise(x / scales[j], y / scales[j], z, 512 / scales[j], 512 / scales[j], 256, permutations);
    }
    return h / 5;
}

function normalizeHeight(vertices, multiplier = 1) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < vertices.length; i += 3) {
        const t = vertices[i + 1];
        if (t > max) max = t;
        if (t < min) min = t;
    }

    // normalize and multiply by gaussian function to create island
    for (let i = 0; i < vertices.length; i += 3) {
        let t = vertices[i + 1];
        t = (t - min) / (max - min);
        //t = t * 2 - 1;
        vertices[i + 1] = t * multiplier;
    }
}

/**
 * @param {LandDescription} description
 * @return {*}
 */
function generateIsland(description) {
    const size = description.size;
    let plane = getPlaneGeometry(size, size, size / 2, size / 2);

    let z = description.z * size;
    for (let i = 0; i < plane.vertices.length; i += 3) {
        const v = plane.vertices;

        let h = getHeight(v[i], v[i + 2], z, description.perlin);
        v[i + 1] += h * 10;
    }

    normalizeHeight(plane.vertices);

    for (let i = 0; i < plane.vertices.length; i += 3) {
        const v = plane.vertices;
        const x = v[i] + size / 2;
        const y = v[i + 2] + size / 2;
        v[i + 1] *= gausian(x, y, size, size, description.sx, description.sy, description.height);
    }

    return flatDuplicate(plane.vertices, plane.indices);
}