import { RenderPipelineState } from "./renderPipeline";
import { GPUBuffer } from "../../gpu/gpuBuffer";
import { CommandBuffer, GPUHackedActionCMD } from "./commandBuffer";
import * as twgl from "twgl.js"

export class RenderEncoder {
    private activeState:RenderPipelineState
    constructor(public cmdBuffer:CommandBuffer){

    }

    setRenderPipelineState(pipelineState:RenderPipelineState){
        this.cmdBuffer.commands.push(new GPUHackedActionCMD(()=>{
            this.activeState = pipelineState
            this.cmdBuffer.device.gl.useProgram(pipelineState.glProgramInfo.program);
        }))
    }
    setVertexBuffer(vertexBuffer:GPUBuffer, offset = 0, index = 0){
        this.cmdBuffer.commands.push(new GPUHackedActionCMD(()=>{
            twgl.setBuffersAndAttributes(this.cmdBuffer.device.gl, this.activeState.glProgramInfo, vertexBuffer.bufferInfo);
        }))
    }
    setUniforms(uniforms:any){
        this.cmdBuffer.commands.push(new GPUHackedActionCMD(()=>{
            twgl.setUniforms(this.activeState.glProgramInfo, uniforms)
        }))
    }
    drawPrimitives(type: string, vertexStart = 0, vertexCount = 3, instanceCount = 1){
        this.cmdBuffer.commands.push(new GPUHackedActionCMD(()=>{
            this.cmdBuffer.device.gl.drawElements(this.cmdBuffer.device.gl.TRIANGLES, vertexCount, this.cmdBuffer.device.gl.UNSIGNED_SHORT, 0);
        }))
    }
    endEncoding(){

    }
}