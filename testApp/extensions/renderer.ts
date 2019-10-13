import { GPUDevice } from "../gpu/gpuDevice";
import { MeshComponent } from "../componentObject/components/mesh/meshComponent";
import { Texture } from "../gpu/texture";
import { MultiviewTexture } from "./multiviewTexture";
import { TransformObject } from "../componentObject/baseObjects/transformObject";
import { TransformComponent } from "../componentObject/components/transform/transformComponent";
import { MaterialComponent } from "../componentObject/components/material/materialComponent";
import { LightObject } from "../componentObject/baseObjects/lightObject";
import { XRHead } from "./xr/xrHead";

export class Renderer {
    constructor(public device: GPUDevice) {

    }
    renderScene(head: XRHead, nodes: Array<TransformObject>, lights: Array<LightObject>) {
        head.updateViewMatrixForCameras()

        lights.forEach((l) => {
            l.transform.computeWorldMatrix()
        })

        nodes.forEach((m) => {

            TransformComponent.depthFirstIterate(m.transform, (node) => {
                TransformComponent.computeWorldMatrixForTree(node)
                // debugger
                var material = node.object.getComponent<MaterialComponent>(MaterialComponent.type)
                var mesh = node.object.getComponent<MeshComponent>(MeshComponent.type)
                if (material && mesh) {

                    // Load material program
                    material.material.load()
                    material.material.updateFromCamera(head.cameras)
                    material.material.updateForLights(lights)

                    // Load material instance specific data
                    material.material.updateUniforms()
                    material.material.updateAndDrawForMesh(mesh)

                }
            })
        })
    }

    setRenderTexture(texture: Texture) {
        this.device.gl.bindFramebuffer(this.device.gl.DRAW_FRAMEBUFFER, texture.frameBuffer)
    }
    setRenderMultiviewTexture(texture: MultiviewTexture) {
        this.device.gl.bindFramebuffer(this.device.gl.DRAW_FRAMEBUFFER, texture.frameBuffer)
    }

    setViewport(x: number, y: number, width: number, height: number) {
        //  this.device.gl.scissor(x, y, width, height)
        this.device.gl.viewport(x, y, width, height);
    }

    clear() {
        this.device.gl.clear(this.device.gl.COLOR_BUFFER_BIT | this.device.gl.DEPTH_BUFFER_BIT | this.device.gl.STENCIL_BUFFER_BIT);
    }
}