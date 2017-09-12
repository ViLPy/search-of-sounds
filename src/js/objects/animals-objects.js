/**
 * @param {AnimalType} animalType
 * @return {{mesh: Mesh, uniforms: Object}}
 */
function getAnimal(animalType) {
    const vertices = [
        0, 0, 0.5, // 0
        -0.1, 0, -0.5, // 1
        0.1, 0, -0.5 // 2
    ];

    if (animalType === AnimalType.BIRD) {
        vertices.push(
            0, 0, 0.15, // 3

            -0.5, 0, 0, // 4
            0.5, 0, 0, // 5

            0, 0, -0.15 //6
        );
    } else {
        vertices[2] = 0.2;
        vertices.push(
            0, 0, -0.5, // 3

            -0.15, 0, -0.7, // 4
            0.15, 0, -0.7 // 5
        );
    }

    const weights = (animalType === AnimalType.BIRD) ? [0, 0, 0, 0, 0.5, 0.5, 0] : [0, 0, 0, 0, 0.1, 0.1];
    const indices = (animalType === AnimalType.BIRD) ? [0, 1, 2, 4, 3, 6, 5, 3, 6] : [0, 1, 2, 4, 3, 5];

    const cylinderAttributes = {
        'vp': {
            value: vertices,
            size: 3
        },
        'w': {
            value: weights,
            size: 1
        }
    };

    const mesh = new Mesh(cylinderAttributes, indices, animalShader);
    const color = (animalType === AnimalType.BIRD) ? [0.9, 0.9, 0.9] : [0, 0.7, 0.7];
    let uniforms = {
        'phase': {value: 0, type: Uniform.FLOAT},
        'color': {value: color, type: Uniform.VEC3}
    };
    mesh.setUniformsData(uniforms);
    return {mesh, uniforms};
}