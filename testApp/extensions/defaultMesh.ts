import { VertexData } from "../gpu/vertexData";
import { MeshObject } from "../componentObject/baseObjects/meshObject";
import { GPUDevice } from "../gpu/gpuDevice";
import { Material } from "../componentObject/components/material/material";
import { Texture } from "../gpu/texture";

export class DefaultMesh {
    static createMesh(device: GPUDevice, options?: { vertexData?: VertexData, material?: Material, texture?: Texture }) {
        var res = new MeshObject(device)
        if (options) {
            if (options.vertexData) {
                res.mesh.vertData = options.vertexData
            }

            if (options.material) {
                res.material.material = options.material
            }
        }
        return res;
    }
}