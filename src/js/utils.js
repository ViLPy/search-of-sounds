/**
 * Identity matrix
 * @param {Array<number>} res
 */
function initMatrix(res) {
    for (let i = 15; i--;) {
        res[i] = 0;
    }
    res[0] = 1;
    res[5] = 1;
    res[10] = 1;
    res[15] = 1;
}

/**
 * Translation matrix
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {Array<number>} res
 */
function translateMatrix(x, y, z, res) {
    initMatrix(res);
    res[12] = x;
    res[13] = y;
    res[14] = z;
}

/**
 * Scaling matrix
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {Array<number>} res
 */
function scaleMatrix(x, y, z, res) {
    initMatrix(res);
    res[0] = x;
    res[5] = y;
    res[10] = z;
}

/**
 * Normalize Vector
 * @param {Array<number>} vec
 * @param {Array<number>} result
 */
function normalizeVec3(vec, result) {
    const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    for (let i = 0; i < 3; i++) {
        result[i] = vec[i] / length;
    }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {Array<number>}
 */
function rotateQuaternion(x, y, z) {
    const cos = Math.cos;
    const sin = Math.sin;

    const c1 = cos(x / 2);
    const c2 = cos(y / 2);
    const c3 = cos(z / 2);

    const s1 = sin(x / 2);
    const s2 = sin(y / 2);
    const s3 = sin(z / 2);

    return [s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3];
}

/**
 * @param {number} rx
 * @param {number} ry
 * @param {number} rz
 * @return {Array<number>}
 */
function rotateMatrix(rx, ry, rz) {
    const q = rotateQuaternion(rx, ry, rz);
    const x = q[0], y = q[1], z = q[2], w = q[3];
    const xx = x * x;
    const xy = x * y;
    const xz = x * z;
    const xw = x * w;

    const yy = y * y;
    const yz = y * z;
    const yw = y * w;

    const zz = z * z;
    const zw = z * w;

    let m00, m10, m20,
        m01, m11, m21,
        m02, m12, m22;

    m00 = 1 - 2 * ( yy + zz );
    m01 = 2 * ( xy - zw );
    m02 = 2 * ( xz + yw );

    m10 = 2 * ( xy + zw );
    m11 = 1 - 2 * ( xx + zz );
    m12 = 2 * ( yz - xw );

    m20 = 2 * ( xz - yw );
    m21 = 2 * ( yz + xw );
    m22 = 1 - 2 * ( xx + yy );

    return [
        m00, m10, m20, 0,
        m01, m11, m21, 0,
        m02, m12, m22, 0,
        0, 0, 0, 1
    ];
}

/**
 * @param {Array<number>} a
 * @param {Array<number>} b
 * @return {Array<number>}
 */
function matrixMul4x4(a, b) {
    let result = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += a[i * 4 + k] * b[k * 4 + j];
            }
            result[i * 4 + j] = sum;
        }
    }

    return result;
}

/**
 * @param {Array<number>} v
 * @return {number}
 */
function lengthSq(v) {
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}

/**
 * @param {Array<Array>} data
 * @param {number} size
 * @return {Array}
 */
function flatten(data, size) {
    const result = new Array(data.length * size);
    data.forEach((itm, i) => itm.forEach((value, j) => result[i * size + j] = value));
    return result;
}

/**
 *
 * @param {Array<number>} vertices
 * @param {Array<number>} indices
 * @param {Array<number>=} uvs
 * @return {{indices: Array<number>, vertices: Array<number>, normals: Array<number>, uvs: Array<number>}}
 */
function flatDuplicate(vertices, indices, uvs) {
    let normals = [], newVertices = [], newIndices = [], newUvs = [];
    let normalHelper = [0, 0, 0];

    for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i];
        const b = indices[i + 1];
        const c = indices[i + 2];

        const aV = vertices.slice(a * 3, a * 3 + 3);
        const bV = vertices.slice(b * 3, b * 3 + 3);
        const cV = vertices.slice(c * 3, c * 3 + 3);

        getNormal(aV, bV, cV, normalHelper);
        normalizeVec3(normalHelper, normalHelper);

        normals.push(normalHelper.slice());
        normals.push(normalHelper.slice());
        normals.push(normalHelper.slice());

        newVertices.push(aV, bV, cV);
        newIndices.push(i, i + 1, i + 2);

        if (uvs) {
            const aUV = uvs.slice(a * 2, a * 2 + 2);
            const bUV = uvs.slice(b * 2, b * 2 + 2);
            const cUV = uvs.slice(c * 2, c * 2 + 2);
            newUvs.push(aUV, bUV, cUV);
        }
    }

    return {
        indices: newIndices, vertices: flatten(newVertices, 3), normals: flatten(normals, 3), uvs: flatten(newUvs, 2)
    };
}

/**
 * Get normal from three points
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @param  {Array} result
 */
function getNormal(p1, p2, p3, result) {
    let vN = [];
    let wN = [];

    for (let i = 0; i < 3; i++) {
        vN[i] = p2[i] - p1[i];
        wN[i] = p3[i] - p1[i];
    }

    result[0] = vN[1] * wN[2] - vN[2] * wN[1];
    result[1] = vN[2] * wN[0] - vN[0] * wN[2];
    result[2] = vN[0] * wN[1] - vN[1] * wN[0];
}

/**
 * Wraps angle to -PI,PI
 * @param {number} angle
 * @return {number}
 */
function wrapAngle(angle) {
    return angle - 2 * Math.PI * Math.floor((angle + Math.PI) / (2 * Math.PI));
}

/**
 * Returns angle difference
 * @param {number} a1
 * @param {number} a2
 * @return {number}
 */
function angleDifference(a1, a2) {
    return Math.abs(Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1)));
}