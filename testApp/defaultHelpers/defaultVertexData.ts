import { VertexData } from "../gpu/vertexData";
import { GPUDevice } from "../gpu/gpuDevice";

import * as twgl from "twgl.js"

export class DefaultVertexData {
    static createCubeVertexData(device: GPUDevice) {
        return new VertexData(device, {
            a_position: [0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5],
            a_normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
            a_texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
            indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
        })
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
            a_position: [-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
            a_normal: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            a_texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
            indices: [2, 1, 0, 3, 1, 2],
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