precision mediump float;
varying vec3 N;
varying vec3 light;
varying vec2 texUV;
uniform sampler2D tex;
const vec3 ambient = vec3(0.2, 0.2, 0.2);

void main() {
    float dotp = max(dot(light, normalize(N)), 0.3);
    gl_FragColor = vec4(dotp * texture2D(tex, texUV).xyz + ambient, 1.);
}