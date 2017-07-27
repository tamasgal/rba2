var testVShader = `
precision highp float;

attribute vec3 position;
attribute float tot;
attribute float time;

varying vec4 hitColor;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float t_min;
uniform float t_max;

void main() {
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

//  gl_PointSize = 10.0 * ( 300.0 / length( mvPosition.xyz ) );
  gl_PointSize = tot * ( 300.0 / length( mvPosition.xyz ) );

  hitColor = vec4(tot / 40.0, 1.0 - tot / 40.0, 0.0, 1.0);
}
`;

var testFShader = `
precision highp float;

varying vec4 hitColor;

uniform vec3 color;
#if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
 vec3 direction;
 vec3 color;
 int shadow;
 float shadowBias;
 float shadowRadius;
 vec2 shadowMapSize;
 };
 uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

void main() {
//  if(distance(gl_PointCoord.st, vec2(0.5, 0.5)) > 0.5) {
//      discard;
//  }

  vec3 N;
  N.xy = gl_PointCoord * 2.0 - vec2(1.0);
  float mag = dot(N.xy, N.xy);

  if (mag > 1.0) {
    discard;
  }

  N.z = sqrt(1.0 - mag);


  vec3 lightDir = directionalLights[1].direction;
  float diffuse = max(0.0, dot(lightDir, N));

  //gl_FragColor = vec4(vec3(color), 1.0);
  gl_FragColor = hitColor;

  gl_FragColor *= diffuse * 1.2;
  gl_FragColor.a = min(1.0, 1.8 - mag);
}
`;

var sphereVShader = `
varying vec3 vColor;
void main()
{
  vColor = vec3(1.0, 0.0, 0.0); // set RGB color associated to vertex; use later in fragment shader.
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = 10.0 * ( 300.0 / length( mvPosition.xyz ) );
  gl_Position = projectionMatrix * mvPosition;
}
`;

var sphereFShader = `
uniform sampler2D texture;
varying vec3 vColor; // colors associated to vertices; assigned by vertex shader
void main()
{
  // calculates a color for the particle
  gl_FragColor = vec4( vColor, 1.0 );
  // sets a white particle texture to desired color
  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
`;
