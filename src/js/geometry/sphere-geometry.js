function getSphereGeometry(radius, widthSegments, heightSegments) {
    widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
    heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

    const phiStart = 0;
    const phiLength = Math.PI * 2;

    const thetaStart = 0;
    const thetaLength = Math.PI;

    const thetaEnd = thetaStart + thetaLength;

    let index = 0;
    const grid = [];

    // buffers

    const indices = [];
    const vertices = [];

    // generate vertices

    for (let iy = 0; iy <= heightSegments; iy++) {
        const v = iy / heightSegments;
        const verticesRow = [];
        for (let ix = 0; ix <= widthSegments; ix++) {

            const u = ix / widthSegments;

            // vertex

            const x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            const y = radius * Math.cos(thetaStart + v * thetaLength);
            const z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

            vertices.push(x, y, z);

            verticesRow.push(index++);
        }

        grid.push(verticesRow);
    }

    // indices

    for (let iy = 0; iy < heightSegments; iy++) {

        for (let ix = 0; ix < widthSegments; ix++) {

            const a = grid[iy][ix + 1];
            const b = grid[iy][ix];
            const c = grid[iy + 1][ix];
            const d = grid[iy + 1][ix + 1];

            if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
            if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);

        }
    }

    return {
        vertices, indices
    };
}