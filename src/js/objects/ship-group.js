function createShipGeometry() {
    let vertices = [0, 1.5, 4.1, 0.9, 1.5, -4.1, 0, 0, -3.9, 0.8, 1, -4.1, 0, 1, 3.8, 1.3, 1.5, -3.1, 1.2, 1, -3.1, 0, 0, -3.1, 1.3, 1.5, 2.1, 0, 0, 3, 1.2, 1, 2.1, 0, 1.5, 3.9, 0.8, 1.5, -3.9, 1.1, 1.5, -3.1, 1.1, 1.5, 2.1, 0, 1.2, 3.9, 0.8, 1.2, -3.9, 1.1, 1.2, -3.1, 1.1, 1.2, 2.1, -0.9, 1.5, -4.1, -0.7, 1, -4.1, -1.2, 1.5, -3.1, -1.1, 1, -3.1, -1.2, 1.5, 2.1, -1.1, 1, 2.1, -0.7, 1.5, -3.9, -1.1, 1.5, -3.1, -1.1, 1.5, 2.1, -0.7, 1.2, -3.9, -1.1, 1.2, -3.1, -1.1, 1.2, 2.1];
    let indices = [4, 8, 0, 3, 7, 2, 6, 1, 5, 7, 10, 9, 10, 5, 8, 9, 10, 4, 5, 14, 8, 5, 12, 13, 8, 11, 0, 13, 18, 14, 12, 17, 13, 11, 18, 15, 17, 28, 29, 23, 4, 0, 20, 7, 22, 19, 22, 21, 7, 24, 22, 21, 24, 23, 9, 4, 24, 27, 21, 23, 21, 25, 19, 11, 23, 0, 30, 26, 27, 29, 25, 26, 11, 30, 27, 17, 30, 18, 15, 18, 30, 1, 25, 12, 12, 28, 16, 3, 2, 20, 1, 20, 19, 4, 10, 8, 3, 6, 7, 6, 3, 1, 7, 6, 10, 10, 6, 5, 5, 13, 14, 5, 1, 12, 8, 14, 11, 13, 17, 18, 12, 16, 17, 11, 14, 18, 17, 16, 28, 23, 24, 4, 20, 2, 7, 19, 20, 22, 7, 9, 24, 21, 22, 24, 27, 26, 21, 21, 26, 25, 11, 27, 23, 30, 29, 26, 29, 28, 25, 11, 15, 30, 17, 29, 30, 1, 19, 25, 12, 25, 28, 1, 3, 20];

    return flatDuplicate(vertices, indices);
}

/** @typedef {{shipGroup: Group, sail: Mesh}} */
let ShipObject;

/**
 * @return {ShipObject}
 */
function getShipObject() {
    let shipUniforms = {
        'sun': {value: [SUN_X, SUN_Y, SUN_Z], type: Uniform.VEC3},
        'color': {value: [0.5, 0.3, 0], type: Uniform.VEC3}
    };

    let shipData = createShipGeometry();
    let shipAttributes = {
        'vp': {
            value: shipData.vertices,
            size: 3
        },
        'normal': {
            value: shipData.normals,
            size: 3
        }
    };
    let shipMesh = new Mesh(shipAttributes, shipData.indices, colorShader);
    shipMesh.setUniformsData(shipUniforms);

    const mastHeight = 8;
    const mastMesh = getColoredCylinder(0.05, 0.15, mastHeight, 4, false, [0.5, 0.3, 0]);
    mastMesh.position = [0, mastHeight / 2, 1];

    let sailAttributes = {
        'vp': {
            value: [0, 0, 0, 0, 7, 0, 0, 0, -3],
            size: 3
        },
        'normal': {
            value: [0, 0, 1, 0, 0, 1, 0, 0, 1],
            size: 3
        }
    };

    let sailUniforms = {
        'sun': {value: [SUN_X, SUN_Y, SUN_Z], type: Uniform.VEC3},
        'color': {value: [1.9, 1.9, 1.9], type: Uniform.VEC3}
    };
    let sailMesh = new Mesh(sailAttributes, [0, 1, 2], colorShader);
    sailMesh.position = [0, 2, 1];
    sailMesh.rotation = rotateMatrix(0, Math.PI / 7, 0);
    sailMesh.setUniformsData(sailUniforms);

    let shipGroup = new Group();
    shipGroup.position = [0, 0, 0];
    shipGroup.addChild(shipMesh);
    shipGroup.addChild(mastMesh);
    shipGroup.addChild(sailMesh);

    return {shipGroup, sail: sailMesh};
}