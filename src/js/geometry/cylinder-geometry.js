function generateCylinder(radiusTop, radiusBottom, height, sections, close = false) {
    let vertices = [],
        indices = [],
        uvs = [];

    const angleStep = 2 * Math.PI / sections;
    for (let i = 0; i <= sections; i++) {
        const angle = angleStep * i;
        const vTop = [radiusTop * Math.cos(angle), height / 2, radiusTop * Math.sin(angle)];
        const vBottom = [radiusBottom * Math.cos(angle), -height / 2, radiusBottom * Math.sin(angle)];
        vertices = vertices.concat(vTop, vBottom);
        if (i > 0) {
            indices.push((i - 1) * 2, i * 2, (i - 1) * 2 + 1);
            indices.push(i * 2, i * 2 + 1, (i - 1) * 2 + 1);
        }
        uvs.push(i / sections, 0, i / sections, 1);
    }

    if (close) {
        for (let i = 0; i < sections - 1; i++) {
            indices.push(i * 2 + 4, i * 2 + 2, 0);
        }
    }

    return {
        vertices, indices, uvs
    };
}