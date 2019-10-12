import { TransformObject } from "./transformObject"
import { Material } from "../components/material"
import { Mesh } from "../components/mesh"
import { DefaultVertexData } from "../../defaultHelpers/defaultVertexData"
import { MaterialA } from "../../sceneGraph/materialA"
import { GPUDevice } from "../../gpu/gpuDevice"
import { Texture } from "../../gpu/texture"

export class MeshObject extends TransformObject {
    material: Material
    mesh: Mesh
    constructor(device: GPUDevice) {
        super()
        var mat = new MaterialA(device)
        this.material = new Material(mat)
        mat.diffuseTexture =
            Texture.createFromeSource(device, [
                192, 192, 192, 255,
                192, 192, 192, 255,
                192, 192, 192, 255,
                192, 192, 192, 255,
            ])

        this.mesh = new Mesh(DefaultVertexData.createPlaneVertexData(device))

        this.addComponent(this.material)
        this.addComponent(this.mesh)
    }
}