attribute vec3 vp;
attribute vec3 normal;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 mV;
uniform vec3 sun;
uniform vec3 color;

varying vec4 clr;
const vec3 ambient = vec3(0.1, 0.1, 0.15);

void main() {
    vec3 N = (view * mV * vec4(normal, 0.)).xyz;
    vec3 light = normalize(sun - vp);

    if (color.x > 1.) {
        clr = vec4(color - vec3(1.), 1.);
    } else {
        float dotp = max(dot(light, normalize(N)), 0.3);
        clr = vec4(dotp * color + ambient, 1.);
    }

    gl_Position = proj * view * mV * vec4(vp, 1.);
}