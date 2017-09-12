function getTreeTrunk() {
    const height = 1.5;
    const trunkMesh = getColoredCylinder(0.02, 0.15, height, 4, false, [0.5, 0.3, 0]);
    trunkMesh.position = [0, height / 2, 0];
    return trunkMesh;
}

function getTreeLeaf() {
    const leafRaw = getSphereGeometry(Math.random() * 0.2 + 0.4, 5, 5);
    const leaf = flatDuplicate(leafRaw.vertices, leafRaw.indices);
    for (let i = 0; i < leaf.vertices.length; i += 3) {
        const x = leaf.vertices[i];
        const y = leaf.vertices[i + 1];
        const z = leaf.vertices[i + 2];
        const dx = PerlinNoise(x, y, z, 32, 32, 32) * 0.3;
        const dy = PerlinNoise(y + 1, z + 1, x + 1, 32, 32, 32) * 0.3;
        const dz = PerlinNoise(z + 2, x + 2, y + 2, 32, 32, 32) * 0.3;
        leaf.vertices[i] += dx;
        leaf.vertices[i + 1] += dy;
        leaf.vertices[i + 2] += dz;
    }

    const leafAttributes = {
        'vp': {
            value: leaf.vertices,
            size: 3
        },
        'normal': {
            value: leaf.normals,
            size: 3
        }
    };

    const leafMesh = new Mesh(leafAttributes, leaf.indices, colorShader);
    let leafUniforms = {
        'sun': {value: [SUN_X, 10, SUN_Z], type: Uniform.VEC3},
        'color': {value: [0.2, 0.38, 0], type: Uniform.VEC3}
    };
    leafMesh.setUniformsData(leafUniforms);
    leafMesh.position = [0, 1, 0];
    return leafMesh;
}

function getPalmLeaf() {
    const size = Math.random() * 0.2 + 0.5;
    const leafRaw = getPlaneGeometry(size, 0.3, 5, 2);
    const leaf = flatDuplicate(leafRaw.vertices, leafRaw.indices);
    // curve
    for (let i = 0; i < leaf.vertices.length; i += 3) {
        const x = leaf.vertices[i] + size / 2;
        leaf.vertices[i] = x;
        leaf.vertices[i + 1] -= (x * x) * 0.8;
        leaf.vertices[i + 2] *= Math.min(x * 3, 1.);
    }

    const leafAttributes = {
        'vp': {
            value: leaf.vertices,
            size: 3
        },
        'normal': {
            value: leaf.normals,
            size: 3
        }
    };

    const leafMesh = new Mesh(leafAttributes, leaf.indices, colorShader);
    let leafUniforms = {
        'sun': {value: [SUN_X, SUN_Y, SUN_Z], type: Uniform.VEC3},
        'color': {value: [0.1, 0.28, 0], type: Uniform.VEC3}
    };
    leafMesh.setUniformsData(leafUniforms);
    //leafMesh.position = [0, 2, 0];
    return leafMesh;
}

function getPalm() {
    const group = new Group();
    group.addChild(getTreeTrunk());
    for (let i = 0, l = ~~(Math.random() * 3) + 3; i < l; i++) {
        const leaf = getPalmLeaf();
        leaf.position = [0, 1.5, 0];
        const turnY = (2 * Math.PI * i / l) + (Math.PI / 5) * (Math.random() - 0.5);
        const turnZ = (Math.PI / 4) * (Math.random() - 0.5);
        leaf.rotation = rotateMatrix(0, turnY, turnZ);
        group.addChild(leaf);
    }

    return group;
}

function getTree() {
    const group = new Group();
    group.addChild(getTreeTrunk());
    group.addChild(getTreeLeaf());

    return group;
}