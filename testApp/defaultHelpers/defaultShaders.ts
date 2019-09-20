import { Shader } from "../gpu/shader";
var _mvv = navigator.userAgent.indexOf("OculusBrowser") > 0 ? "GL_OVR_multiview" : "GL_OVR_multiview2"
export class DefaultShaders {
  
  static vertShaderA = new Shader(`
  #version 300 es
  #extension `+_mvv+` : require
  precision mediump float;
  layout (num_views = 2) in;
    uniform View {
      mat4 u_viewInverseL;
      mat4 u_viewProjectionL;
      mat4 u_viewInverseR;
      mat4 u_viewProjectionR;
      mat4 u_vl;
      mat4 u_vr;
      mat4 u_pl;
      mat4 u_pr;
    };
    
    uniform Lights {
      mediump vec3 u_lightWorldPos;
      mediump vec4 u_lightColor;
    } lights[2];
    
    uniform Model {
      mat4 u_world;
      mat4 u_worldInverseTranspose;
    } foo;
    
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_texcoord;
    
    out vec4 v_position;
    out vec2 v_texCoord;
    out vec3 v_normal;
    out vec3 v_surfaceToLight;
    out vec3 v_surfaceToView;
    
    void main() {
      mat4 u_viewInverse = gl_ViewID_OVR == 0u ? (u_viewInverseL) :  (u_viewInverseR);
      mat4 u_viewProjection = gl_ViewID_OVR == 0u ? u_viewProjectionL :  u_viewProjectionR;

      v_texCoord = a_texcoord;
      v_position = (u_viewProjection * foo.u_world * a_position);
      v_normal = (foo.u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
      v_surfaceToLight = lights[0].u_lightWorldPos - (foo.u_world * a_position).xyz;
      v_surfaceToView = (u_viewInverse[3] - (foo.u_world * a_position)).xyz;
      gl_Position = v_position;
    }
      
  `)

  static fragShaderA = new Shader(`
    #version 300 es
    precision mediump float;
    
    in vec4 v_position;
    in vec2 v_texCoord;
    in vec3 v_normal;
    in vec3 v_surfaceToLight;
    in vec3 v_surfaceToView;
    
    uniform Lights {
      vec3 u_lightWorldPos;
      vec4 u_lightColor;
    } lights[2];
    
    uniform sampler2D u_diffuse;
    
    uniform Material {
      vec4 u_ambient;
      vec4 u_specular;
      float u_shininess;
      float u_specularFactor;
    };
    
    out vec4 theColor;
    
    vec4 lit(float l ,float h, float m) {
      return vec4(1.0,
                  max(abs(l), 0.0),
                  (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
                  1.0);
    }
    
    
    
    void main() {
      vec4 diffuseColor = texture(u_diffuse, v_texCoord);
      vec3 a_normal = normalize(v_normal);
      vec3 surfaceToLight = normalize(v_surfaceToLight);
      vec3 surfaceToView = normalize(v_surfaceToView);
      vec3 halfVector = normalize(surfaceToLight + surfaceToView);
      vec4 litR = lit(dot(a_normal, surfaceToLight),
                        dot(a_normal, halfVector), u_shininess);
      vec4 outColor = vec4((
      lights[0].u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient +
                    u_specular * litR.z * u_specularFactor)).rgb,
          diffuseColor.a);
      theColor = outColor;
    }
      
  `)


static quadVertShader = new Shader(`
#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

out vec2 v_texCoord;

void main() {
  v_texCoord = a_texcoord;
    gl_Position = a_position;
}
      
`)

static blueFragShader = new Shader(`
    #version 300 es
    precision mediump float;

    uniform mediump sampler2DArray imgs;
    
    in vec4 v_position;
    in vec2 v_texCoord;
    
    out vec4 theColor;
    
    void main() {
      vec2 coord = v_texCoord;
      float side = step(0.5, coord.x);
      coord.x = (coord.x - (0.5*side))*2.0;
      theColor = texture(imgs, vec3(coord, side));
    }
      
`)
}
