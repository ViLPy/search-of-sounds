attribute vec3 vp;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 mV;
uniform vec3 sun;

varying vec3 N;
varying vec3 light;
varying vec2 texUV;

void main() {
    N = (view * mV * vec4(normal, 0.)).xyz;
    texUV = uv;
    light = normalize(sun - vp);
    gl_Position = proj * view * mV * vec4(vp, 1.);
}