/**
 * @param {number} height
 * @param {number} topR
 * @param {number} bottomR
 * @param {number} sections
 * @param {boolean} isClosed
 * @param {Array<number>} color
 * @return {Mesh}
 */
function getColoredCylinder(topR, bottomR, height, sections, isClosed, color) {
    const data = generateCylinder(topR, bottomR, height, sections, isClosed);
    const cylinder = flatDuplicate(data.vertices, data.indices);
    const cylinderAttributes = {
        'vp': {
            value: cylinder.vertices,
            size: 3
        },
        'normal': {
            value: cylinder.normals,
            size: 3
        }
    };

    const mesh = new Mesh(cylinderAttributes, cylinder.indices, colorShader);
    let pyramidUniforms = {
        'sun': {value: [SUN_X, 10, SUN_Z], type: Uniform.VEC3},
        'color': {value: color, type: Uniform.VEC3}
    };
    mesh.setUniformsData(pyramidUniforms);
    return mesh;
}

/**
 * @param {number} height
 * @param {number} topR
 * @param {number} bottomR
 * @param {number} sections
 * @param {boolean} isClosed
 * @param {Object} texture
 * @return {Mesh}
 */
function getTexturedCylinder(topR, bottomR, height, sections, isClosed, texture) {
    const data = generateCylinder(topR, bottomR, height, sections, isClosed);
    const cylinder = flatDuplicate(data.vertices, data.indices, data.uvs);
    const cylinderAttributes = {
        'vp': {
            value: cylinder.vertices,
            size: 3
        },
        'normal': {
            value: cylinder.normals,
            size: 3
        },
        'uv': {
            value: cylinder.uvs,
            size: 2
        }
    };

    const mesh = new Mesh(cylinderAttributes, cylinder.indices, textureShader);
    let pyramidUniforms = {
        'sun': {value: [SUN_X, 10, SUN_Z], type: Uniform.VEC3},
        'tex': {value: texture, type: Uniform.TEX, textureId: 0}
    };
    mesh.setUniformsData(pyramidUniforms);
    return mesh;
}

function getLighthouse() {
    const lightHouseGroup = new Group();

    const bodyHeight = 6;
    const bodyMesh = getTexturedCylinder(0.9, 1.3, bodyHeight, 7, false, globalTextures['l']);
    bodyMesh.position = [0, bodyHeight / 2, 0];
    bodyMesh.rotation = rotateMatrix(0, Math.PI * 2 * Math.random(), 0);
    lightHouseGroup.addChild(bodyMesh);

    const headBaseHeight = 0.2;
    const headBaseMesh = getColoredCylinder(1.2, 1.2, headBaseHeight, 8, true, [0.3, 0.3, 0.3]);
    headBaseMesh.position = [0, headBaseHeight / 2 + bodyHeight, 0];
    lightHouseGroup.addChild(headBaseMesh);

    const headHeight = 1;
    const headMesh = getColoredCylinder(0.8, 0.8, headHeight, 6, false, [1, 1, 0.2]);
    headMesh.position = [0, headHeight / 2 + bodyHeight + headBaseHeight, 0];
    lightHouseGroup.addChild(headMesh);

    const capHeight = 0.8;
    const capMesh = getColoredCylinder(0.01, 1.1, capHeight, 4, false, [0.7, 0.1, 0.1]);
    capMesh.position = [0, capHeight / 2 + bodyHeight + headBaseHeight + headHeight, 0];
    lightHouseGroup.addChild(capMesh);

    return lightHouseGroup;
}

function getPillar(hasBase) {
    const pillarGroup = new Group();
    if (hasBase) {
        const headBaseHeight = 0.4;
        const headBaseMesh = getColoredCylinder(0.7, 0.8, headBaseHeight, 4, true, [0.85, 0.85, 0.85]);
        headBaseMesh.position = [0, headBaseHeight / 2, 0];
        pillarGroup.addChild(headBaseMesh);
    }

    const bodyHeight = 4;
    const bodyMesh = getTexturedCylinder(0.4, 0.5, bodyHeight, 4, false, globalTextures['plr']);
    bodyMesh.position = [0, bodyHeight / 2, 0];
    pillarGroup.addChild(bodyMesh);

    const headHeight = 1;
    const headMesh = getColoredCylinder(0.01, 0.4, headHeight, 4, false, [0.85, 0.85, 0.85]);
    headMesh.position = [0, headHeight / 2 + bodyHeight, 0];
    pillarGroup.addChild(headMesh);

    return pillarGroup;
}

function getPyramid() {
    const group = new Group();
    const height = 5;
    const mesh = getColoredCylinder(0.01, height, height, 4, true, [0.8, 0.5, 0]);
    mesh.position = [0, height / 2, 0];
    group.addChild(mesh);

    const stairs = getColoredCylinder(0.5, 1.6, 2, 4, true, [0.7, 0.4, 0]);
    stairs.position = [-1.7, 1, 1.7];
    group.addChild(stairs);

    return group;
}

function getHouse() {
    const group = new Group();
    const bodyHeight = 1.5;
    const bodySize = bodyHeight * 0.8;
    const bodyMesh = getTexturedCylinder(bodySize, bodySize, bodyHeight, 4, false, globalTextures['hs']);
    bodyMesh.position = [0, bodyHeight / 2, 0];
    group.addChild(bodyMesh);

    const roofHeight = 0.1;
    const roofMesh = getColoredCylinder(bodySize + 0.2, bodySize + 0.2, roofHeight, 4, true, [0.2, 0.1, 0]);
    roofMesh.position = [0, bodyHeight, 0];
    group.addChild(roofMesh);

    return group;
}