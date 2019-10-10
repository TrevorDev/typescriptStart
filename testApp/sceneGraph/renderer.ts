import { Camera } from "./camera";
import { GPUDevice } from "../gpu/gpuDevice";
import { Light } from "./light";
import { Mesh } from "./../composableObject/components/mesh";
import { Texture } from "../gpu/texture";
import { MultiviewTexture } from "../gpu/multiviewTexture";
import { XRCamera } from "../xr/xrCamera";
import { TransformObject } from "../composableObject/baseObjects/transformObject";
import { Transform } from "../composableObject/components/transform";
import { Material } from "../composableObject/components/material";
import { MeshObject } from "../composableObject/baseObjects/meshObject";
import { LightObject } from "../composableObject/baseObjects/lightObject";
import { CameraObject } from "../composableObject/baseObjects/cameraObject";

export class Renderer {
    constructor(public device: GPUDevice) {

    }
    renderScene(camera: XRCamera, nodes: Array<TransformObject>, lights: Array<LightObject>) {
        camera.computeWorldMatrix()


        lights.forEach((l) => {
            l.transform.computeWorldMatrix()
        })

        nodes.forEach((m) => {

            Transform.depthFirstIterate(m.transform, (node) => {
                Transform.computeWorldMatrixForTree(node)
                // debugger
                var material = node.object.getComponent<Material>(Material.type)
                var mesh = node.object.getComponent<Mesh>(Mesh.type)
                if (material && mesh) {

                    // Load material program
                    material.material.load()
                    material.material.updateFromCamera(camera)
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
        this.device.gl.scissor(x, y, width, height)
        this.device.gl.viewport(x, y, width, height);
    }

    clear() {
        this.device.gl.enable(this.device.gl.DEPTH_TEST);
        //this.device.gl.enable(this.device.gl.CULL_FACE);
        this.device.gl.clear(this.device.gl.COLOR_BUFFER_BIT | this.device.gl.DEPTH_BUFFER_BIT);
    }
}