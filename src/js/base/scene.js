class Scene {
    constructor() {
        this.translateM = [];
        this.position = [0, -31, -31];
        translateMatrix(this.position[0], this.position[1], this.position[2], this.translateM);

        this.rotateM = rotateMatrix(Math.PI / 4, 0, 0);

        this.projectionMatrix = [1.299, 0, 0, 0, 0, 1.732, 0, 0, 0, 0, -1, -1, 0, 0, -0.2, 0];
        this.sceneViewMatrix = matrixMul4x4(
            this.translateM,
            this.rotateM
        );

        this.mapClusters = [];
        this.commonObject = [];
    }

    addCommonObject(object) {
        this.commonObject.push(object);
    }

    addObject(x, y, object) {
        const clusterId = coordinateToClusterId(x, y);
        if (!this.mapClusters[clusterId]) {
            this.mapClusters[clusterId] = [];
        }
        this.mapClusters[clusterId].push(object);

        // init shaders and buffers which happens on render
        object.render(this.projectionMatrix, this.sceneViewMatrix);
    }

    getObjectsToRender(x, y) {
        const objectsAround = getClustersAround(x, y).reduce((objects, cluster) => {
            if (this.mapClusters[cluster]) {
                return objects.concat(this.mapClusters[cluster]);
            } else {
                return objects;
            }
        }, []);

        return objectsAround.concat(this.commonObject);
    }

    renderScene(x, y) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        translateMatrix(this.position[0], this.position[1], this.position[2], this.translateM);
        this.sceneViewMatrix = matrixMul4x4(
            this.translateM,
            this.rotateM
        );

        this.getObjectsToRender(x, y).forEach((object) => {
            object.render(this.projectionMatrix, this.sceneViewMatrix);
        });
    }
}
