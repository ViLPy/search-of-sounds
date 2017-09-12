const vertexLandShaderSource = sLib.land_v;
const fragmentLandShaderSource = sLib.land_f;
const vertexColorShaderSource = sLib.color_v;
const fragmentColorShaderSource = sLib.color_f;
const vertexTexShaderSource = sLib.tex_v;
const fragmentTexShaderSource = sLib.tex_f;
const vertexOceanSource = sLib.ocean_v;
const fragmentOceanSource = sLib.ocean_f;
const vertexAnimalShaderSource = sLib.anim_v;
const fragmentAnimalShaderSource = sLib.anim_f;

let oceanShader = undefined;
let landShader = undefined;
let colorShader = undefined;
let textureShader = undefined;
let animalShader = undefined;

function buildShaders() {
    oceanShader = compileAndLinkShader(vertexOceanSource, fragmentOceanSource);
    landShader = compileAndLinkShader(vertexLandShaderSource, fragmentLandShaderSource);
    colorShader = compileAndLinkShader(vertexColorShaderSource, fragmentColorShaderSource);
    textureShader = compileAndLinkShader(vertexTexShaderSource, fragmentTexShaderSource);
    animalShader = compileAndLinkShader(vertexAnimalShaderSource, fragmentAnimalShaderSource);
}

function getShader(gl, sourceCode, type) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

/**
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 */
function compileAndLinkShader(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = getShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = getShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
}
