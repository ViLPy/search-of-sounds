/** @typedef {{perlin: Array<number>, z: number, size: number, height: number, sx: number, sy: number}} */
let LandDescription;

const LAND_SIZE = 100;

/**
 * @return {LandDescription}
 */
function buildLandDescription() {
    return {
        perlin: getPerlinPermutations(),
        z: Math.random() * 32,
        size: LAND_SIZE, // fixed for now
        height: Math.random() * 12 + 2,
        sx: Math.random() * 0.5 + 0.5,
        sy: Math.random() * 0.5 + 0.5
    };
}

class Land {
    /**
     * @param {LandDescription} description
     * @param {Array<number>} position
     */
    constructor(description, position) {
        this.landData = generateIsland(description);
        this.group = new Group();
        this.group.position = position;
        this.heightMap = [];

        this.buildLandMesh();
        this.buildHeightMap(description);
        this.buildStatics(description);
        this.buildTrees(description);
    }

    /**
     * @param {LandDescription} description
     * @param {number} skip
     */
    getHarborPlace(description, skip = 1) {
        let itemsToSkip = skip;
        const entryAngle = 2 * Math.PI * Math.random();
        const halfSize = description.size / 2;
        for (let i = Math.SQRT2 * halfSize; i > 0; i--) {
            const entryX = ~~(Math.sin(entryAngle) * i + halfSize / 2);
            const entryZ = ~~(Math.cos(entryAngle) * i + halfSize / 2);
            if (entryX < 0 || entryX >= halfSize || entryZ < 0 || entryZ >= halfSize) {
                continue;
            }
            if (this.heightMap[entryX][entryZ] > 0) {
                if (itemsToSkip) {
                    itemsToSkip--;
                    continue;
                }
                return [
                    entryX * 2 - halfSize,
                    this.heightMap[entryX][entryZ] - 1,
                    entryZ * 2 - halfSize];
            }
        }
    }

    buildLandMesh() {
        let landAttributes = {
            'vp': {
                value: this.landData.vertices,
                size: 3
            },
            'normal': {
                value: this.landData.normals,
                size: 3
            }
        };

        let landMesh = new Mesh(landAttributes, this.landData.indices, landShader);
        let landUniforms = {
            'sun': {value: [SUN_X, SUN_Y, SUN_Z], type: Uniform.VEC3},
            'noise': {value: globalTextures['p0'], type: Uniform.TEX, textureId: 0},
        };
        landMesh.position = [0, -0.5, 0];
        landMesh.setUniformsData(landUniforms);
        this.group.addChild(landMesh);
    }

    buildTrees(description) {
        const heightsAboveSea = [];
        for (let i = 0; i < this.heightMap.length; i++) {
            for (let j = 0; j < this.heightMap[i].length; j++) {
                if (this.heightMap[i][j] > 0.5) {
                    heightsAboveSea.push([i, j]);
                }
            }
        }
        shuffle(heightsAboveSea);

        const treesForCurrentGfx = (gfxQuality === 3) ? 20 : (gfxQuality === 2) ? 15 : 10;
        const maxTrees = Math.min(treesForCurrentGfx, heightsAboveSea.length * 0.1);
        for (let i = 0; i < maxTrees; i++) {
            const coords = heightsAboveSea[i];
            if (!coords) {
                break;
            }
            const p = [
                coords[0] * 2 - description.size / 2 + Math.random() - 0.5,
                this.heightMap[coords[0]][coords[1]],
                coords[1] * 2 - description.size / 2 + Math.random() - 0.5
            ];
            const tree = (p[1] < 2) ? getPalm() : getTree();
            const height = Math.random() * 0.25 + 1;
            tree.scale = [height, height, height];
            tree.rotation = rotateMatrix(0, Math.random() * Math.PI, 0);
            tree.position = p;
            this.group.addChild(tree);
        }

        for (let i = maxTrees; i < maxTrees + Math.ceil(gfxQuality * Math.random()); i++) {
            const houseCoords = heightsAboveSea[i];
            if (!houseCoords) {
                return;
            }
            const p = [
                houseCoords[0] * 2 - description.size / 2 + Math.random() - 0.5,
                this.heightMap[houseCoords[0]][houseCoords[1]] - 0.5,
                houseCoords[1] * 2 - description.size / 2 + Math.random() - 0.5
            ];
            const house = getHouse();
            house.position = p;
            house.rotation = rotateMatrix(0, Math.random() * Math.PI, 0);
            this.group.addChild(house);
        }
    }

    /**
     * @param {LandDescription} description
     */
    buildStatics(description) {
        const isRelativelyFlat = description.height <= 5;
        let position;
        if (isRelativelyFlat) {
            position = [0, this.heightMap[25][25] - 0.5, 0];
        } else {
            position = this.getHarborPlace(description, 1) || [0, this.heightMap[25][25] - 0.5, 0];
        }
        const building = (isRelativelyFlat) ? getPyramid() : getLighthouse();
        // size is fixed to 50
        building.position = position;
        this.group.addChild(building);

        if (isRelativelyFlat) {
            [[-3.5, 3.5], [3.5, 3.5], [-3.5, -3.5], [3.5, -3.5]].forEach((shift) => {
                const building = getPillar(true);
                building.scale = [0.6, 0.6, 0.6];
                building.position = [position[0] + shift[0], position[1] + 0.5, position[2] + shift[1]];
                this.group.addChild(building);
            });
        }
    }

    /**
     * @param {LandDescription} description
     */
    buildHeightMap(description) {
        // actually halved resolution
        this.heightMap = [];
        for (let x = 0; x <= description.size / 2; x++) {
            this.heightMap[x] = [];
            for (let z = 0; z <= description.size / 2; z++) {
                this.heightMap[x][z] = -0.5;
            }
        }

        for (let i = 0; i < this.landData.vertices.length; i += 3) {
            const x = ~~(this.landData.vertices[i]) + description.size / 2;
            const y = this.landData.vertices[i + 1];
            const z = ~~(this.landData.vertices[i + 2]) + description.size / 2;
            this.heightMap[0 | x / 2][0 | z / 2] = y - 0.5;
        }
    }

    getRenderable() {
        return this.group;
    }
}