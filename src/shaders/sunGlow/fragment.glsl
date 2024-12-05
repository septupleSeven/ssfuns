uniform float uZoom;

varying vec3 vNormal;

void main () {
    vec3 lightSource = vec3(0.0, 0.0, 1.0);
    float strength = 1.0 / (uZoom / 2.0);
    float intensity = pow(1.0 - dot(vNormal, lightSource), 4.0) * strength;
    vec3 lightColor = vec3(1, 0.3, 0.0);

    gl_FragColor = vec4(lightColor, 0.4) * intensity;
}