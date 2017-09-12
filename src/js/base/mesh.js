class Mesh {
    /**
     * @param {!Object} attributes
     * @param {Array<number>} indices
     * @param {WebGLProgram} shaderProgram
     */
    constructor(attributes, indices, shaderProgram) {
        this.shaderProgram = shaderProgram;
        this.verticesIndexBuffer = null;
        this.rotation = rotateMatrix(0, 0, 0);
        this.position = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.indices = indices || [];
        this.selfTransform = this.rotation;
        this.attributes = attributes;
        this.ready = false;
        // skip at least projection matrix uniform if already set
        this.isProjectionSet = false;

        /** @dict */
        this.uniforms = {
            'proj': {value: [], type: Uniform.M4X4},
            'view': {value: [], type: Uniform.M4X4},
            'mV': {value: this.selfTransform, type: Uniform.M4X4}
        };

        // init matrices
        this.translateM = [];
        this.scaleM = [];
        this.refreshMatrices();
    }

    refreshMatrices() {
        scaleMatrix(this.scale[0], this.scale[1], this.scale[2], this.scaleM);
        translateMatrix(this.position[0], this.position[1], this.position[2], this.translateM);
    }

    setUniformsData(uniforms) {
        this.uniforms = Object.assign(this.uniforms, uniforms);
    }

    prepareShaderData() {
        Object.keys(this.uniforms).forEach((key) => {
            this.uniforms[key].location = gl.getUniformLocation(this.shaderProgram, key);
        });

        Object.keys(this.attributes).forEach((key) => {
            this.attributes[key].location = gl.getAttribLocation(this.shaderProgram, key);
            gl.enableVertexAttribArray(this.attributes[key].location);
        });
    }

    initBuffers() {
        Object.keys(this.attributes).forEach((key) => {
            this.attributes[key].buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attributes[key].buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.attributes[key].value), gl.STATIC_DRAW);
        });

        if (this.indices.length) {
            this.verticesIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        }
    }

    setUniforms(projectionMatrix, viewMatrix) {
        this.uniforms['proj'].value = projectionMatrix;
        this.uniforms['view'].value = viewMatrix;
        this.uniforms['mV'].value = this.selfTransform;

        Object.keys(this.uniforms).forEach((key) => {
            const uniformData = this.uniforms[key];
            const uniformLocation = uniformData.location;
            switch (uniformData.type) {
                case Uniform.FLOAT:
                    gl.uniform1f(uniformLocation, uniformData.value);
                    break;
                case Uniform.FLOAT_ARRAY:
                    gl.uniform1fv(uniformLocation, new Float32Array(uniformData.value));
                    break;
                case Uniform.VEC2:
                    gl.uniform2f(uniformLocation, uniformData.value[0], uniformData.value[1]);
                    break;
                case Uniform.VEC3:
                    gl.uniform3f(uniformLocation, uniformData.value[0], uniformData.value[1], uniformData.value[2]);
                    break;
                case Uniform.M4X4:
                    if (key === 'proj' && this.isProjectionSet) break;
                    gl.uniformMatrix4fv(uniformLocation, false, new Float32Array(uniformData.value));
                    break;
                case Uniform.TEX:
                    gl.activeTexture(gl['TEXTURE' + uniformData.textureId]);
                    gl.bindTexture(gl.TEXTURE_2D, uniformData.value);
                    gl.uniform1i(uniformLocation, uniformData.textureId);
                    break;
            }
        });
        this.isProjectionSet = true;
    }

    /**
     * @param {Array<number>} projectionMatrix
     * @param {Array<number>} viewMatrix
     * @param {Array<number>=} parentTransform
     */
    render(projectionMatrix, viewMatrix, parentTransform) {
        if (!this.ready) {
            this.prepareShaderData();
            this.initBuffers();
            this.ready = true;
        }

        this.refreshMatrices();
        const scaleTransform = matrixMul4x4(
            this.scaleM,
            this.translateM
        );

        if (parentTransform) {
            const scaleRotate = matrixMul4x4(
                this.rotation,
                scaleTransform
            );

            this.selfTransform = matrixMul4x4(
                scaleRotate,
                parentTransform
            );
        } else {
            this.selfTransform = matrixMul4x4(
                this.rotation,
                scaleTransform
            );
        }

        gl.useProgram(this.shaderProgram);
        this.setUniforms(projectionMatrix, viewMatrix);

        Object.keys(this.attributes).forEach((key) => {
            const attribute = this.attributes[key];
            gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
            gl.vertexAttribPointer(attribute.location, attribute.size, gl.FLOAT, false, 0, 0);
        });

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
