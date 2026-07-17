export const FRAGMENT_SHADER = `
varying vec3 vColor;
varying float vAlpha;
varying vec3 vNormal;

uniform vec3 uColorStart;
uniform vec3 uColorEnd;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));

  float ambient = 0.4;
  float diffuse = max(0.0, dot(normal, lightDir)) * 0.6;
  float lighting = ambient + diffuse;

  vec3 color = mix(uColorStart, uColorEnd, vAlpha) * lighting;

  gl_FragColor = vec4(color, vAlpha);
}
`
