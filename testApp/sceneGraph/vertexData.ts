import * as twgl from "twgl.js"
import { GPUDevice } from "../cmdBuffer/engine/gpuDevice";

export class VertexData {
    public gpuBufferInfo:twgl.BufferInfo
    constructor(device:GPUDevice,data:{
        position: Array<number>
        normal: Array<number>
        texcoord: Array<number>
        indices: Array<number>
    }){
        this.gpuBufferInfo = twgl.createBufferInfoFromArrays(device.gl, data);
    }
}