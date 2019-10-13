import { TransformObject } from "./transformObject"
import { MaterialComponent } from "../components/material/materialComponent"
import { MeshComponent } from "../components/mesh/meshComponent"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { BasicMaterial } from "../components/material/basicMaterial"
import { GPUDevice } from "../../gpu/gpuDevice"
import { Texture } from "../../gpu/texture"

export class MeshObject extends TransformObject {
    material: MaterialComponent
    mesh: MeshComponent
    constructor(device: GPUDevice) {
        super()
        var mat = new BasicMaterial(device)
        this.material = new MaterialComponent(mat)
        mat.diffuseTexture =
            Texture.createFromeSource(device, [
                0, 192, 0, 255,
                192, 0, 0, 255,
                0, 0, 192, 255,
                192, 192, 192, 255,
            ])

        this.mesh = new MeshComponent(DefaultVertexData.createCubeVertexData(device))

        this.addComponent(this.material)
        this.addComponent(this.mesh)
    }
}