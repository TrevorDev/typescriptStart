import { RenderPipelineState } from "./renderPipeline";
import { GPUBuffer } from "./gpuBuffer";
import { CommandBuffer } from "./commandBuffer";
import * as twgl from "twgl.js"

export class RenderEncoder {
    private activeState:RenderPipelineState
    constructor(public cmdBuffer:CommandBuffer){

    }

    setRenderPipelineState(pipelineState:RenderPipelineState){
        //this.cmdBuffer.commands.push()
        this.activeState = pipelineState
        this.cmdBuffer.device.gl.useProgram(pipelineState.glProgramInfo.program);
    }
    setVertexBuffer(vertexBuffer:GPUBuffer, offset = 0, index = 0){
        twgl.setBuffersAndAttributes(this.cmdBuffer.device.gl, this.activeState.glProgramInfo, vertexBuffer.bufferInfo);
    }
    setUniforms(uniforms:any){
        twgl.setUniforms(this.activeState.glProgramInfo, uniforms)
    }
    drawPrimitives(type: string, vertexStart = 0, vertexCount = 3, instanceCount = 1){
        this.cmdBuffer.device.gl.drawElements(this.cmdBuffer.device.gl.TRIANGLES, vertexCount, this.cmdBuffer.device.gl.UNSIGNED_SHORT, 0);
    }
    endEncoding(){

    }
}