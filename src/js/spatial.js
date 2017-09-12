/**
 * Get cluster id from coordinates
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
function coordinateToClusterId(x, y) {
    return ~~(x / CLUSTER_WIDTH) + ~~(y / CLUSTER_HEIGHT) * CLUSTER_AMOUNT;
}

/**
 * Get clusters around current one
 * @param {number} x
 * @param {number} y
 * @return {Array}
 */
function getClustersAround(x, y) {
    let result = [];
    const cx = ~~(x / CLUSTER_WIDTH);
    const cy = ~~(y / CLUSTER_HEIGHT);

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if ((cx + i) >= 0 && (cx + i) < CLUSTER_AMOUNT && (cy + j) >= 0 && (cy + j) < CLUSTER_AMOUNT) {
                result.push(cx + i + (cy + j) * CLUSTER_AMOUNT);
            }
        }
    }

    return result;
}