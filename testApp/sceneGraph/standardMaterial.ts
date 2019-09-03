
import * as twgl from "twgl.js"
import { Material } from "./material";
import { DefaultShaders } from "../defaultHelpers/defaultShaders";
import { GPUDevice } from "../cmdBuffer/engine/gpuDevice";
import { Camera } from "./camera";
import { TransformNode } from "./transformNode";
import { Mesh } from "./mesh";

// export class StandardMaterialFactory {
//     createInstance(){
//         return new StandardMaterial()
//     }
// }

export class StandardMaterial implements Material {
    programInfo:twgl.ProgramInfo
    viewUboInfo:twgl.UniformBlockInfo
    lightUboInfo:twgl.UniformBlockInfo
    materialUboInfo:twgl.UniformBlockInfo
    modelUboInfo:twgl.UniformBlockInfo
    constructor(public device:GPUDevice){
        this.programInfo = twgl.createProgramInfo(device.gl, [DefaultShaders.vertShader.str, DefaultShaders.fragShader.str])

        this.viewUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "View");
        const viewProjection = this.viewUboInfo.uniforms.u_viewProjection || new Float32Array(16);
         const viewInverse = this.viewUboInfo.uniforms.u_viewInverse || new Float32Array(16);

        this.lightUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Lights[0]");
        twgl.setBlockUniforms(this.lightUboInfo, {
            u_lightColor: [1,1,1,1],
            u_lightWorldPos: [20,20,20],
        });
        twgl.setUniformBlock(device.gl, this.programInfo, this.lightUboInfo);
        //lightUboInfos.push(lightUbo);

        this.materialUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Material");
        twgl.setBlockUniforms(this.materialUboInfo, {
        u_ambient: [0, 0, 0, 1],
        u_specular: [1,1,1,1],
        u_shininess: 100,
        u_specularFactor: 0.8,
        });
        twgl.setUniformBlock(device.gl, this.programInfo, this.materialUboInfo);
        //materialUboInfos.push(materialUbo);

        this.modelUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Model");
        var m4 = twgl.m4
        const world = m4.translation([0,0,0]);
        //m4.setTranslation())
        twgl.setBlockUniforms(this.modelUboInfo, {
          u_world: world,
          u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
        });
        twgl.setUniformBlock(device.gl, this.programInfo, this.modelUboInfo);
    }

    load(){
        this.device.gl.useProgram(this.programInfo.program);
    }
    updateFromCamera(camera:Camera){
        camera.worldMatrix.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewInverse)
        camera.viewProjection.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjection)
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.viewUboInfo);
    }
    updateForLights(lights:Array<TransformNode>){

    }
    updateForMesh(mesh:Mesh){

    }
}