class Group {
    constructor() {
        this.objects = [];
        this.rotation = rotateMatrix(0, 0, 0);
        this.position = [0, 0, 0];
        this.scale = [1, 1, 1];

        // init matrices
        this.translateM = [];
        this.scaleM = [];
        this.refreshMatrices();
    }

    refreshMatrices() {
        scaleMatrix(this.scale[0], this.scale[1], this.scale[2], this.scaleM);
        translateMatrix(this.position[0], this.position[1], this.position[2], this.translateM);
    }

    addChild(obj) {
        this.objects.push(obj);
    }

    /**
     * @param {Array<number>} projectionMatrix
     * @param {Array<number>} viewMatrix
     * @param {Array<number>=} parentTransformation
     */
    render(projectionMatrix, viewMatrix, parentTransformation) {
        this.refreshMatrices();
        let transformation = matrixMul4x4(
            this.rotation,
            matrixMul4x4(
                this.scaleM,
                this.translateM
            )
        );

        if (parentTransformation) {
            transformation = matrixMul4x4(
                transformation,
                parentTransformation
            );
        }

        this.objects.forEach((obj) => {
            obj.render(projectionMatrix, viewMatrix, transformation);
        });
    }
}