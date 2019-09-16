
import * as twgl from "twgl.js"
import { Material } from "./material";
import { DefaultShaders } from "../defaultHelpers/defaultShaders";
import { GPUDevice } from "../cmdBuffer/engine/gpuDevice";
import { Camera } from "./camera";
import { TransformNode } from "./transformNode";
import { Mesh } from "./mesh";
import { Texture } from "../cmdBuffer/engine/texture";
import { PointLight } from "./pointLight";
import { Vector3 } from "../math/vector3";
import { Matrix4 } from "../math/matrix4";
import { VertexData } from "./vertexData";
import { Shader } from "../cmdBuffer/engine/shader";


export class CustomProgram {
    programInfo:twgl.ProgramInfo
    constructor(public device:GPUDevice, vertShader:Shader, fragShader:Shader){
        this.programInfo = twgl.createProgramInfo(device.gl, [vertShader.str, fragShader.str])
    }

    load(){
        this.device.gl.useProgram(this.programInfo.program);
    }
   
    updateUniforms(uniforms:any){
        twgl.setUniforms(this.programInfo, uniforms)
    }

    setTextures(textures:{[key:string]:Texture}){
        var u:any = {}
        for(var key in textures){
            u[key] = textures[key].glTexture
        }
        twgl.setUniforms(this.programInfo, u);
    }
    draw(vertexData:VertexData){
        twgl.setBuffersAndAttributes(this.device.gl, this.programInfo, vertexData.gpuBufferInfo); // Set object vert data
        twgl.drawBufferInfo(this.device.gl, vertexData.gpuBufferInfo);
    }
}