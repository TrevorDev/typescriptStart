import { MaterialA } from "../sceneGraph/materialA";
import { GPUDevice } from "../gpu/gpuDevice";
import { Texture } from "../gpu/texture";
import { DefaultVertexData } from "./defaultVertexData";
import { Mesh } from "../sceneGraph/mesh";

export class DefaultMesh {
    static defaultMaterial: null | MaterialA = null;

    static initMat(device: GPUDevice) {
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
    }

    static createSphere(device: GPUDevice) {
        DefaultMesh.initMat(device)

        var vertData = DefaultVertexData.createSphereVertexData(device)
        return new Mesh(vertData, DefaultMesh.defaultMaterial!)
    }

    static createCube(device: GPUDevice) {
        DefaultMesh.initMat(device)

        var vertData = DefaultVertexData.createCubeVertexData(device)
        return new Mesh(vertData, DefaultMesh.defaultMaterial!)
    }
    static createPlane(device: GPUDevice) {
        DefaultMesh.initMat(device)

        var vertData = DefaultVertexData.createPlaneVertexData(device)
        return new Mesh(vertData, DefaultMesh.defaultMaterial!)
    }

    static createCylinder(device: GPUDevice) {
        DefaultMesh.initMat(device)

        var vertData = DefaultVertexData.createCylinderVertexData(device)
        return new Mesh(vertData, DefaultMesh.defaultMaterial!)
    }
}