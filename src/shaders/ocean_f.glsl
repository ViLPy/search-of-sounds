precision mediump float;
precision mediump int;

varying vec2 uv;
varying float height;

uniform float time;
uniform sampler2D sampler;
uniform sampler2D sampler2;

void main() {
    vec4 textureColor1 = texture2D(sampler, uv + vec2(0., 0.0003 * time * 0.9));
    vec4 textureColor2 = texture2D(sampler2, uv + vec2(0.0003 * time * 0.8, 0.));

    vec3 oceanblue = vec3(0., 0.41, 0.58);
    vec3 ambient = vec3(0.1, 0.1, 0.10);
    vec3 color = oceanblue + vec3(abs(height / 3.)) + ambient;
    if (textureColor1.r + textureColor2.r > .9) {
        color += (textureColor1.xyz + textureColor2.xyz) / 8.;
    }

    gl_FragColor = vec4(color, 0.9);
}