function getPlaneGeometry(width, height, widthSegments, heightSegments, y = 0) {
    const width_half = width / 2;
    const height_half = height / 2;

    const gridX = Math.floor(widthSegments) || 1;
    const gridY = Math.floor(heightSegments) || 1;

    const segment_width = width / gridX;
    const segment_height = height / gridY;

    // buffers
    const indices = [];
    const vertices = [];
    const uvs = [];
    const anchors = [];
    let nextIndex = 0;
    // generate vertices, normals and uvs

    for (let iy = 0; iy < gridY; iy++) {
        for (let ix = 0; ix < gridX; ix++) {
            const x1 = ix * segment_width - width_half;
            const y1 = iy * segment_height - height_half;
            const x2 = (ix + 1) * segment_width - width_half;
            const y2 = iy * segment_height - height_half;
            const x3 = ix * segment_width - width_half;
            const y3 = (iy + 1) * segment_height - height_half;
            const x4 = (ix + 1) * segment_width - width_half;
            const y4 = (iy + 1) * segment_height - height_half;

            vertices.push(x1, y, -y1);
            vertices.push(x2, y, -y2);
            vertices.push(x3, y, -y3);

            vertices.push(x3, y, -y3);
            vertices.push(x2, y, -y2);
            vertices.push(x4, y, -y4);
            indices.push(
                nextIndex, nextIndex + 1, nextIndex + 2,
                nextIndex + 3, nextIndex + 4, nextIndex + 5
            );

            uvs.push((x1 + width_half) / width, (y1 + height_half) / height);
            uvs.push((x2 + width_half) / width, (y2 + height_half) / height);
            uvs.push((x3 + width_half) / width, (y3 + height_half) / height);

            uvs.push((x3 + width_half) / width, (y3 + height_half) / height);
            uvs.push((x2 + width_half) / width, (y2 + height_half) / height);
            uvs.push((x4 + width_half) / width, (y4 + height_half) / height);

            for (let i = 0; i < 3; i++) {
                anchors.push((x1 + x2 + x3) / 3, (-y1 - y2 - y3) / 3);
            }

            for (let i = 0; i < 3; i++) {
                anchors.push((x3 + x2 + x4) / 3, (-y3 - y2 - y4) / 3);
            }

            nextIndex += 6;
        }
    }

    return {
        vertices, indices, anchors, uvs
    };
}
