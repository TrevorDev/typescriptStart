import { Shader } from "./shader";
import * as twgl from "twgl.js"
import { GPUDevice } from "./gpuDevice";

export class RenderPipelineDescriptor {
    public vertexFunction: Shader
    public fragmentFunction:Shader
}

export class RenderPipelineState {
    glProgramInfo:twgl.ProgramInfo
    constructor(device: GPUDevice, public desc:RenderPipelineDescriptor){
        this.glProgramInfo = twgl.createProgramInfo(device.gl, [desc.vertexFunction.str, desc.fragmentFunction.str])
    }
}