import { GPUDevice } from "./gpuDevice";
import * as twgl from "twgl.js"

// TODO is this used?
export class GPUBuffer {
    public bufferInfo:twgl.BufferInfo
    constructor(device:GPUDevice, data: {
        position: number[];
        normal: number[];
        texcoord: number[];
        indices: number[];
    }){
        this.bufferInfo = twgl.createBufferInfoFromArrays(device.gl, data);
    }
}