attribute vec3 vp;
attribute vec3 normal;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 mV;
uniform vec3 sun;

varying vec3 N;
varying vec3 light;
varying float height;
varying vec2 uv;

void main() {
    N = (view * mV * vec4(normal, 0.)).xyz;
    light = normalize(sun - vp);
    height = vp.y;
    uv = (vp.xz + vec2(16., 16.)) / 32.;
    gl_Position = proj * view * mV * vec4(vp, 1.);
}