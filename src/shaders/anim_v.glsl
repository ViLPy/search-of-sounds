attribute vec3 vp;
attribute float w;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 mV;
uniform float phase;

void main() {
    gl_Position = proj * view * mV * vec4(vp + vec3(0.,sin(phase) * w,0.), 1.);
}