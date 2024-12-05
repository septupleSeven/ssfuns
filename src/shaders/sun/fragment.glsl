uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec4 tex = texture2D(uTexture, vUv);
    gl_FragColor = tex;
}