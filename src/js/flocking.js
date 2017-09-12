/** @typedef {{mesh: Mesh, uniforms: Object, swingPhase: number, entityAngle: number, flockAnchor: Array<number>, flockTarget: Array<number>}} */
let Flock;

/**
 *
 * @param {AnimalType} type
 * @param {number} amount
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} ySpread
 * @return {Array<Flock>}
 */
function flockCreate(type, amount, x, y, z, ySpread) {
    let flock = [];

    for (let i = amount; i--;) {
        const entity = getAnimal(type);
        entity.mesh.position = [
            x + Math.random() * 10 - 5,
            y + Math.random() * ySpread - ySpread / 2,
            z + Math.random() * 10 - 5
        ];
        flock.push({
            mesh: entity.mesh,
            uniforms: entity.uniforms,
            swingPhase: 0,
            entityAngle: Math.random() * Math.PI * 2,
            flockAnchor: [x, y, z],
            flockTarget: [
                x + Math.random() * 60 - 30,
                y + Math.random() * ySpread - ySpread / 2,
                z + Math.random() * 60 - 30
            ]
        });
    }

    return flock;
}

/**
 * @param {number} dt
 * @param {Array<Flock>} flock
 */
function flockAnimate(dt, flock) {
    const turnRate = Math.PI / 80;
    flock.forEach((obj) => {
        obj.swingPhase += dt * 8 * Math.random();
        obj.uniforms['phase'].value = obj.swingPhase;
        const angleToTarget = Math.atan2(
            obj.flockTarget[0] - obj.mesh.position[0],
            obj.flockTarget[2] - obj.mesh.position[2]);
        const angleDiff = angleDifference(angleToTarget, obj.entityAngle);
        if (Math.abs(angleDiff) > turnRate * 2) {
            if (angleDiff < 0) {
                obj.entityAngle += turnRate;
            } else {
                obj.entityAngle -= turnRate;
            }
        }

        obj.mesh.rotation = rotateMatrix(0, obj.entityAngle, 0);
        obj.mesh.position[0] += Math.sin(obj.entityAngle) * 0.1;
        obj.mesh.position[2] += Math.cos(obj.entityAngle) * 0.1;

        const distanceVec = [
            obj.mesh.position[0] - obj.flockTarget[0],
            obj.mesh.position[1] - obj.flockTarget[1],
            obj.mesh.position[2] - obj.flockTarget[2]];

        if (lengthSq(distanceVec) < 10) {
            obj.flockTarget[0] = obj.flockAnchor[0] + Math.random() * 60 - 30;
            obj.flockTarget[2] = obj.flockAnchor[2] + Math.random() * 60 - 30;
        }
    });
}