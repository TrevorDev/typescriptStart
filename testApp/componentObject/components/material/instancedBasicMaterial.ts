import * as twgl from "twgl.js"
import { Material } from "./material";
import { GPUDevice } from "../../../gpu/gpuDevice";
import { Texture } from "../../../gpu/texture";
import { PointLight } from "../light/pointLight";
import { Vector3 } from "../../../math/vector3";
import { Matrix4 } from "../../../math/matrix4";
import { MeshComponent } from "../mesh/meshComponent";
import { LightObject } from "../../baseObjects/lightObject";
import { CameraObject } from "../../baseObjects/cameraObject";
import { Shader } from "../../../gpu/shader";
import { Color } from "../../../math/color";
import { InstanceGroup } from "../../../extensions/instanceGroup";

export class InstancedBasicMaterial implements Material {
  static _defaultTexture: Texture;

  programInfo: twgl.ProgramInfo
  viewUboInfo: twgl.UniformBlockInfo
  diffuseTexture: Texture
  lightingAmount = 1;
  tmpMat = new Matrix4()
  ambientColor = new Color(0.35, 0.35, 0.35, 1)
  specularColor = new Color(0.2, 0.2, 0.2, 1)
  shininess = 100
  specularFactor = 0.8

  constructor(public device: GPUDevice) {
    if (!InstancedBasicMaterial._defaultTexture) {
      InstancedBasicMaterial._defaultTexture = Texture.createFromeSource(device, [
        0, 192, 0, 255,
        192, 0, 0, 255,
        0, 0, 192, 255,
        192, 192, 192, 255,
      ])
    }
    this.diffuseTexture = InstancedBasicMaterial._defaultTexture
    this.programInfo = twgl.createProgramInfo(device.gl, [InstancedBasicMaterial.vertShader.str, InstancedBasicMaterial.fragShader.str])

    this.viewUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "View");

  }

  load() {
    this.device.gl.useProgram(this.programInfo.program);
  }
  updateFromCamera(cameras: Array<CameraObject>) {
    cameras[0].camera.projection.multiplyToRef(cameras[0].camera.view, this.tmpMat)
    this.tmpMat.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionL)

    cameras[1].camera.projection.multiplyToRef(cameras[1].camera.view, this.tmpMat)
    this.tmpMat.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionR)

    twgl.setUniformBlock(this.device.gl, this.programInfo, this.viewUboInfo);
  }
  updateForLights(lights: Array<LightObject>) {
  }
  updateUniforms() {
  }
  updateAndDrawForMesh(mesh: MeshComponent) {
  }

  updateAndDrawInstanced(ig: InstanceGroup) {
    twgl.setAttribInfoBufferFromArray(this.device.gl, ig.vertexData.gpuBufferInfo.attribs!.instanceWorld, ig.instanceWorlds)
    twgl.setBuffersAndAttributes(this.device.gl, this.programInfo, ig.vertexData.gpuBufferInfo); // Set object vert data

    // Set world matrix and inverse transpose
    // mesh.object.transform.worldMatrix.copyToArrayBufferView(this.modelUboInfo.uniforms.u_world)
    // mesh.object.transform.worldMatrix.inverseToRef(this.tmpMat)
    // this.tmpMat.transposeToRef(this.tmpMat)
    // this.tmpMat.copyToArrayBufferView(this.modelUboInfo.uniforms.u_worldInverseTranspose)
    // twgl.setUniformBlock(this.device.gl, this.programInfo, this.modelUboInfo);

    //twgl.bindUniformBlock(this.device.gl, this.programInfo, this.modelUboInfo);  // model position
    //twgl.drawBufferInfo(this.device.gl, ig.vertexData.gpuBufferInfo);
    twgl.drawBufferInfo(this.device.gl, ig.vertexData.gpuBufferInfo, this.device.gl.TRIANGLES, ig.vertexData.gpuBufferInfo.numElements, 0, ig.numInstances);
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
        };
        
        in vec4 a_position;
        in vec3 a_normal;
        in vec2 a_texcoord;
        in mat4 instanceWorld;
        
        void main() {
          mat4 u_viewInverse = gl_ViewID_OVR == 0u ? (u_viewInverseL) :  (u_viewInverseR);
          mat4 u_viewProjection = gl_ViewID_OVR == 0u ? u_viewProjectionL :  u_viewProjectionR;
    
          gl_Position = (u_viewProjection * instanceWorld * a_position);
        }
          
      `)

  static fragShader = new Shader(`
      #version 300 es
      precision mediump float;
      
      out vec4 theColor;
      
      void main() {        
        theColor = vec4(0.2,0.2,0.6,1.);
      }
        
    `)

}