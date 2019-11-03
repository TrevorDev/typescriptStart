import { TransformObject } from "./transformObject"
import { MaterialComponent } from "../components/material/materialComponent"
import { MeshComponent } from "../components/mesh/meshComponent"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { BasicMaterial } from "../components/material/basicMaterial"
import { GPUDevice } from "../../gpu/gpuDevice"
import { Texture } from "../../gpu/texture"
import { Material } from "../components/material/material"

export class MeshObject extends TransformObject {
    material: MaterialComponent
    mesh: MeshComponent

    /**
     * Creats a mesh object with a given material
     * @param device device to use for allocation
     * @param material material (default: new BasicMaterial)
     */
    constructor(device: GPUDevice, material: Material = new BasicMaterial(device), vertData = DefaultVertexData.createCubeVertexData(device)) {
        super()
        this.material = new MaterialComponent(material)
        this.mesh = new MeshComponent(vertData)

        this.addComponent(this.material)
        this.addComponent(this.mesh)
    }
}