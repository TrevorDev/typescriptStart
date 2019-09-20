import * as twgl from "twgl.js"
import { GPUDevice } from "./gpuDevice";

export class VertexData {
    public gpuBufferInfo:twgl.BufferInfo
    constructor(device:GPUDevice,data:{
        a_position: Array<number>
        a_normal: Array<number>
        a_texcoord: Array<number>
        indices: Array<number>
    }){
        this.gpuBufferInfo = twgl.createBufferInfoFromArrays(device.gl, data);
    }
}