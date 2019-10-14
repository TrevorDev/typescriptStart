import { VertexData } from "../gpu/vertexData";
import { MeshObject } from "../componentObject/baseObjects/meshObject";
import { GPUDevice } from "../gpu/gpuDevice";
import { Material } from "../componentObject/components/material/material";
import { Texture } from "../gpu/texture";
import { Vector3 } from "../math/vector3";
import { BasicMaterial } from "../componentObject/components/material/basicMaterial";
import { Color } from "../math/color";

export class DefaultMesh {
    static createMesh(device: GPUDevice, options?: { vertexData?: VertexData, material?: Material, texture?: Texture, color?: Color }) {
        var res = new MeshObject(device)
        if (options) {
            if (options.vertexData) {
                res.mesh.vertData = options.vertexData
            }

            if (options.material) {
                res.material.material = options.material
            } else if (options.texture) {
                (res.material.material as BasicMaterial).diffuseTexture = options.texture
            } else if (options.color) {
                var src = [Math.floor(255 * options.color.r), Math.floor(255 * options.color.g), Math.floor(255 * options.color.b), Math.floor(255 * options.color.a)];
                (res.material.material as BasicMaterial).diffuseTexture = Texture.createFromeSource(device, src)
            }
        }
        return res;
    }
}