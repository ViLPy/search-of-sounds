precision mediump float;
precision mediump int;

attribute vec3 vp;
attribute vec2 anchor;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 mV;

uniform float time;
uniform float waves[144];
uniform vec3 light;
uniform vec2 deltaP;
float WATER_SIZE = 190.;

void waveFunction(in float aTime, in vec3 position, out vec3 result) {
    result = position;
    for (int i = 0; i < 144; i += 6) {
        float amplitude = waves[i] * waves[i + 2];
        vec2 direction = vec2(waves[i + 4], waves[i + 5]);
        float k = 6.28 / waves[i];
        vec2 K = normalize(direction) * k;
        float wT = waves[i + 3] * 0.5 * k * aTime;

        result.y += -amplitude * cos(dot(K, position.xz) - wT);
    }
    result.y *= 0.05;
}

varying vec2 uv;
varying float height;

void main() {
    vec3 P;
    vec3 anchor3 = vec3(anchor.x , 0., anchor.y);
    vec3 vertexPos = vp;

    float dx = (deltaP.x + anchor.x + WATER_SIZE / 2.);
    float nx = float(int((deltaP.x + anchor.x + sign(dx) * WATER_SIZE / 2.) / WATER_SIZE));
    vertexPos.x -= nx * WATER_SIZE;
    anchor3.x -= nx * WATER_SIZE;

    float dy = (deltaP.y + anchor.y + WATER_SIZE / 2.);
    float ny = float(int((deltaP.y + anchor.y + sign(dy) * WATER_SIZE / 2.) / WATER_SIZE));
    vertexPos.z -= ny * WATER_SIZE;
    anchor3.z -= ny * WATER_SIZE;

    waveFunction(time, vertexPos, P);

    P.y = max(P.y, -0.22);

    vec3 pos = (mV * vec4(P, 1.)).xyz;
    uv = vec2((P.x + WATER_SIZE / 2. ) / WATER_SIZE, (P.z + WATER_SIZE / 2. ) / WATER_SIZE);

    height = P.y;
    gl_Position = proj * view * vec4(pos, 1.);
}