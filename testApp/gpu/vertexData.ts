import * as twgl from "twgl.js"
import { GPUDevice } from "./gpuDevice";

export class VertexData {
    public gpuBufferInfo: twgl.BufferInfo
    constructor(device: GPUDevice, private cpuData: {
        a_position: Array<number>
        a_normal: Array<number>
        a_texcoord: Array<number>
        indices: Array<number>
    }) {
        this.gpuBufferInfo = twgl.createBufferInfoFromArrays(device.gl, cpuData);
    }

    getPositions() {
        return this.cpuData.a_position
    }
    getNormals() {
        return this.cpuData.a_normal
    }
    getTexCoords() {
        return this.cpuData.a_texcoord
    }
    getIndices() {
        return this.cpuData.indices
    }
}