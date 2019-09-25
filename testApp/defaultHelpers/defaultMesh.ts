import { MaterialA } from "../sceneGraph/materialA";
import { GPUDevice } from "../gpu/gpuDevice";
import { Texture } from "../gpu/texture";
import { DefaultVertexData } from "./defaultVertexData";
import { Mesh } from "../sceneGraph/mesh";

export class DefaultMesh {
    static defaultMaterial: null | MaterialA = null;

    static createSphere(device: GPUDevice) {
        if (!DefaultMesh.defaultMaterial) {
            DefaultMesh.defaultMaterial = new MaterialA(device)
            DefaultMesh.defaultMaterial.diffuseTexture =
                Texture.createFromeSource(device, [
                    0, 192, 0, 255,
                    192, 0, 0, 255,
                    0, 0, 192, 255,
                    192, 192, 192, 255,
                ])
        }

        var cubeVertexData = DefaultVertexData.createSphereVertexData(device)

        return new Mesh(cubeVertexData, DefaultMesh.defaultMaterial)
    }
}