precision mediump float;

uniform sampler2D noise;
varying vec3 N;
varying vec3 light;
varying float height;
varying vec2 uv;

const vec3 grass = vec3(0., 0.48, 0.);
const vec3 sandColor = vec3(0.9, 0.7, 0.);
const vec3 baseColor = vec3(0.5, 0.3, 0.);
const vec3 ambient = vec3(0.1, 0.1, 0.1);

void main() {
    float dotValue = max(dot(normalize(light), normalize(N)), 0.0);
    float dh = height + (texture2D(noise, uv).r) / 4.;
    if (height < 0.3) {
        float dist = abs(height - 0.3);
        float fogDensity = 20.;
        float fogFactor = 1.0 / exp( dist * dist * fogDensity * fogDensity);
        fogFactor = clamp( fogFactor, 0.0, 1.0 );
        vec3 finalColor = mix(vec3(0.), dotValue * sandColor + ambient, fogFactor);
        gl_FragColor = vec4(finalColor, 1.);
    } else if (dh < 0.8) {
        gl_FragColor = vec4(dotValue * sandColor + ambient, 1.);
    } else if (dh > 3.) {
        gl_FragColor = vec4(dotValue * baseColor + ambient, 1.);
    } else {
        gl_FragColor = vec4(dotValue * grass + ambient, 1.);
    }
}