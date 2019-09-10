import { VertexData } from "../sceneGraph/vertexData";
import { GPUDevice } from "../cmdBuffer/engine/gpuDevice";

export class DefaultVertexData {
    static createCubeVertexData(device:GPUDevice){
        return new VertexData(device, {
            a_position: [0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5],
            a_normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
            a_texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
            indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
          })
    }

    static createFullScreenQuad(device:GPUDevice){
        return new VertexData(device, {
            a_position: [-1,-1,0, -1,1,0, 1,-1,0, 1,1,0],
            a_normal: [0,0,1,0,0,1,0,0,1,0,0,1],
            a_texcoord: [0,0, 0,1, 1,0, 1,1],
            indices: [2, 1, 0, 3, 1, 2],
          })
    }

    static createDualFullScreenQuad(device:GPUDevice){
        return new VertexData(device, {
            a_position: [-1,-1,0, -1,1,0, 1,-1,0, 1,1,0],
            a_normal: [0,0,1,0,0,1,0,0,1,0,0,1],
            a_texcoord: [0,0, 0,1, 1,0, 1,1],
            indices: [2, 1, 0, 3, 1, 2],
          })
    }
}