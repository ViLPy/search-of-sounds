/**
 * Returns array of cluster center coords within sublcuster + additional coords within same subcluster
 * @return {Array<number>}
 */
function createWorldMap() {
    // 2x2 sub clusters
    const clusterSize = 2;
    const lands = [];
    for (let cy = 0 | CLUSTER_AMOUNT / clusterSize; cy--;) {
        for (let cx = 0 | CLUSTER_AMOUNT / clusterSize; cx--;) {
            const subX = 0 | Math.random() * clusterSize;
            const subY = 0 | Math.random() * clusterSize;
            const x = (cx * clusterSize + subX) * CLUSTER_WIDTH + CLUSTER_WIDTH / 2;
            const y = (cy * clusterSize + subY) * CLUSTER_HEIGHT + CLUSTER_HEIGHT / 2;
            const x2 = (cx * clusterSize + (subX + 1) % clusterSize) * CLUSTER_WIDTH + CLUSTER_WIDTH / 2;
            const y2 = (cy * clusterSize + (subY + 1) % clusterSize) * CLUSTER_HEIGHT + CLUSTER_HEIGHT / 2;
            lands.push([x, y, x2, y2]);
        }
    }

    return lands;
}