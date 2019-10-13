
import * as twgl from "twgl.js"
import { Material } from "./material";
import { DefaultShaders } from "../../../extensions/defaultShaders";
import { GPUDevice } from "../../../gpu/gpuDevice";
import { Texture } from "../../../gpu/texture";
import { PointLight } from "../light/pointLight";
import { Vector3 } from "../../../math/vector3";
import { Matrix4 } from "../../../math/matrix4";
import { MeshComponent } from "../mesh/meshComponent";
import { LightObject } from "../../baseObjects/lightObject";
import { CameraObject } from "../../baseObjects/cameraObject";
import { Shader } from "../../../gpu/shader";

// export class StandardMaterialFactory {
//     createInstance(){
//         return new StandardMaterial()
//     }
// }

export class BasicMaterial implements Material {
    programInfo: twgl.ProgramInfo
    viewUboInfo: twgl.UniformBlockInfo
    lightUboInfo: twgl.UniformBlockInfo
    materialUboInfo: twgl.UniformBlockInfo
    modelUboInfo: twgl.UniformBlockInfo
    diffuseTexture: null | Texture = null
    lightingAmount = 1;
    tmpMat = new Matrix4()
    constructor(public device: GPUDevice) {
        this.programInfo = twgl.createProgramInfo(device.gl, [BasicMaterial.vertShader.str, BasicMaterial.fragShader.str])

        this.lightUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Lights[0]");
        this.viewUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "View");

        this.materialUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Material");
        twgl.setBlockUniforms(this.materialUboInfo, {
            u_ambient: [0, 0, 0, 1],
            u_specular: [1, 1, 1, 1],
            u_shininess: 100,
            u_specularFactor: 0.8,
        });
        twgl.setUniformBlock(device.gl, this.programInfo, this.materialUboInfo);
        //materialUboInfos.push(materialUbo);

        this.modelUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Model");
        var m4 = twgl.m4
        const world = m4.translation([0, 0, 0]);
        //m4.setTranslation())
        twgl.setBlockUniforms(this.modelUboInfo, {
            u_world: world,
            u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
        });
        twgl.setUniformBlock(device.gl, this.programInfo, this.modelUboInfo);
    }

    load() {
        this.device.gl.useProgram(this.programInfo.program);
    }
    updateFromCamera(cameras: Array<CameraObject>) {
        cameras[0].camera.projection.multiplyToRef(cameras[0].camera.view, this.tmpMat)
        this.tmpMat.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionL)

        cameras[1].camera.projection.multiplyToRef(cameras[1].camera.view, this.tmpMat)
        this.tmpMat.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionR)


        // camera.viewInverse.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewInverseL)
        // camera.viewProjection.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionL)
        // camera.viewInverse.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewInverseR)
        // camera.viewProjectionR.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionR)
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.viewUboInfo);
    }
    updateForLights(lights: Array<LightObject>) {
        // TODO fix all this
        var light = lights[0].light.lightSpec as PointLight
        var tmp = new Vector3()
        lights[0].transform.worldMatrix.decompose(tmp)
        //debugger
        twgl.setBlockUniforms(this.lightUboInfo, {
            u_lightColor: [light.color.v[0], light.color.v[1], light.color.v[2], 1],
            u_lightWorldPos: [tmp.x, tmp.y, tmp.z],
        });
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.lightUboInfo);
    }
    updateUniforms() {
        this.setTextures({
            u_diffuse: this.diffuseTexture!,
        })

        twgl.setBlockUniforms(this.materialUboInfo, {
            u_ambient: [0, 0, 0, 1],
            u_specular: [0.2, 0.2, 0.2, 1],
            u_shininess: 100,
            u_specularFactor: 0.8,
        });
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.materialUboInfo);
    }
    setTextures(textures: { [key: string]: Texture }) {
        var u: any = {}
        for (var key in textures) {
            u[key] = textures[key].glTexture
        }
        twgl.setUniforms(this.programInfo, u);
    }
    updateAndDrawForMesh(mesh: MeshComponent) {
        //this.device.gl.cullFace(this.device.gl.FRONT_FACE)

        twgl.setBuffersAndAttributes(this.device.gl, this.programInfo, mesh.vertData.gpuBufferInfo); // Set object vert data

        // Set world matrix and inverse transpose
        mesh.object.transform.worldMatrix.copyToArrayBufferView(this.modelUboInfo.uniforms.u_world)
        mesh.object.transform.worldMatrix.inverseToRef(this.tmpMat)
        this.tmpMat.transposeToRef(this.tmpMat)
        this.tmpMat.copyToArrayBufferView(this.modelUboInfo.uniforms.u_worldInverseTranspose)
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.modelUboInfo);

        twgl.bindUniformBlock(this.device.gl, this.programInfo, this.modelUboInfo);  // model position
        twgl.drawBufferInfo(this.device.gl, mesh.vertData.gpuBufferInfo);
    }


    static vertShader = new Shader(`
    #version 300 es
      #extension GL_OVR_multiview2 : require
      layout (num_views = 2) in;
      precision mediump float;
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

    static fragShader = new Shader(`
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
        vec4 outColor = vec4((lights[0].u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient + u_specular * litR.z * u_specularFactor)).rgb, diffuseColor.a);
        theColor = outColor;
      }
        
    `)

}