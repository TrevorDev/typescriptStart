import { TransformNode, NodeType } from "./transformNode";
import { Camera } from "./camera";
import { GPUDevice } from "../gpu/gpuDevice";
import { Light } from "./light";
import { Mesh } from "./mesh";
import { Texture } from "../gpu/texture";
import { MultiviewTexture } from "../gpu/multiviewTexture";
import { XRCamera } from "../xr/xrCamera";

export class Renderer {
    constructor(public device: GPUDevice) {

    }
    renderScene(camera: XRCamera, nodes: Array<TransformNode>, lights: Array<Light>) {
        camera.computeWorldMatrix()


        lights.forEach((l) => {
            l.computeWorldMatrix()
        })

        nodes.forEach((m) => {

            TransformNode.depthFirstIterate(m, (node) => {
                TransformNode.computeWorldMatrixForTree(node)
                if (node.type == NodeType.MESH) {

                    var mesh = node as Mesh

                    // Load material program
                    mesh.material.load()
                    mesh.material.updateFromCamera(camera)
                    mesh.material.updateForLights(lights)

                    // Load material instance specific data
                    mesh.material.updateUniforms()
                    mesh.material.updateAndDrawForMesh(mesh)

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