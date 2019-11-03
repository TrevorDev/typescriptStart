import { VertexData } from "../gpu/vertexData";
import { GPUDevice } from "../gpu/gpuDevice";

import * as twgl from "twgl.js"

export class DefaultVertexData {
    // TODO cleanup instanceData and make work on all vertexData types
    static createCubeVertexData(device: GPUDevice, instanceData: any = {}) {
        var data = twgl.primitives.createCubeVertices(1) as any
        var cpuData: any = {
            a_position: data.position,
            a_normal: data.normal,
            a_texcoord: data.texcoord,
            indices: data.indices,
        }
        for (var key in instanceData) {
            cpuData[key] = instanceData[key]
        }
        return new VertexData(device, cpuData)
    }

    static createSphereVertexData(device: GPUDevice) {
        var data = twgl.primitives.createSphereVertices(0.5, 16, 16) as any

        return new VertexData(device, {
            a_position: data.position,
            a_normal: data.normal,
            a_texcoord: data.texcoord,
            indices: data.indices,
        });
    }

    static createCylinderVertexData(device: GPUDevice) {
        var data = twgl.primitives.createTruncatedConeVertices(0.5, 0.5, 1, 6, 1) as any

        return new VertexData(device, {
            a_position: data.position,
            a_normal: data.normal,
            a_texcoord: data.texcoord,
            indices: data.indices,
        });
    }

    static createPlaneVertexData(device: GPUDevice) {
        var data = twgl.primitives.createPlaneVertices(1, 1) as any

        return new VertexData(device, {
            a_position: data.position,
            a_normal: data.normal,
            a_texcoord: data.texcoord,
            indices: data.indices,
        });
    }

    static createFullScreenQuad(device: GPUDevice) {
        return new VertexData(device, {
            a_position: [0.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,

                0.0, 1.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 1.0, 0.0,

                0.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                0.0, 1.0, 1.0,

                0.0, 1.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 1.0, 1.0,],
            a_normal: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            a_texcoord: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        })
    }

    static createDualFullScreenQuad(device: GPUDevice) {
        return new VertexData(device, {
            a_position: [-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
            a_normal: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            a_texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
            indices: [2, 1, 0, 3, 1, 2],
        })
    }
}