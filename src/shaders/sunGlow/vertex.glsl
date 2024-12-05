varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * modelPosition;
    vNormal = normalize(normalMatrix * normal);
}