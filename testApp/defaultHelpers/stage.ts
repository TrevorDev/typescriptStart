import { RenderWindow } from "../gpu/renderWindow";
import { GPUDevice } from "../gpu/gpuDevice";
import { Texture } from "../gpu/texture";
import { Mesh } from "../sceneGraph/mesh";
import { DefaultVertexData } from "../defaultHelpers/defaultVertexData";
import { PointLight } from "../sceneGraph/pointLight";
import { Renderer } from "../sceneGraph/renderer";
import { MaterialA } from "../sceneGraph/materialA";
import { CustomProgram } from "../gpu/customProgram";
import { XR, XRState } from "../xr/xr";
import { Loop } from "../sceneGraph/loop";
import { XRCamera } from "../xr/xrCamera";
import { DefaultShaders } from "../defaultHelpers/defaultShaders";
import { VideoTexture } from "../defaultHelpers/videoTexture";
import { Light } from "../sceneGraph/light";
import { TransformNode } from "../sceneGraph/transformNode";

export class Stage {
    // Debug flags
    singleViewDebug = true;

    // Initialize device and window
    device: GPUDevice
    xr: XR
    window: RenderWindow
    renderer: Renderer
    camera: XRCamera
    lights = new Array<Light>()
    private nodes = new Array<TransformNode>()
    renderLoop: ((deltaTime: number, curTime: number) => void) | null = null

    addNode(node: TransformNode) {
        this.nodes.push(node)
    }
    removeNode(node: TransformNode) {
        var index = this.nodes.indexOf(node)
        if (index >= 0) {
            this.nodes.splice(index, 1);
        }
    }


    constructor() {
        // Initialize Renderer
        this.device = new GPUDevice()
        this.xr = new XR(this.device);
        this.window = new RenderWindow(this.device, true)
        this.renderer = new Renderer(this.device)

        // Lights and camera
        this.camera = new XRCamera()

        this.lights.push(new PointLight())
        this.lights[0].position.z = 5;
        this.lights[0].position.x = 10;
        this.lights[0].position.y = 10;

        // Custom blit operation used to draw multiview frame into single frame required for webVR
        // TODO remove this after webXR allows submit multiview frames
        var quad = DefaultVertexData.createFullScreenQuad(this.device)
        var fullScreenQuadProg = new CustomProgram(this.device, DefaultShaders.quadVertShader, DefaultShaders.multiviewBlitToTextureFragShader)

        var time = (new Date()).getTime()
        var gameLoop = () => {
            var newTime = (new Date()).getTime()
            var deltaTime = (newTime - time) / 1000;
            time = newTime;

            if (this.renderLoop) {
                this.renderLoop(deltaTime, time)
            }

            // Clear and set viewport
            if (this.xr.state != XRState.IN_XR) {
                this.window.updateDimensions()
            }

            // Render next action to to multiview texture
            this.renderer.setRenderMultiviewTexture(this.xr.multiviewTexture)

            // Setup viewport and clear
            this.renderer.setViewport(0, 0, this.xr.multiviewTexture.width, this.xr.multiviewTexture.height)
            this.device.gl.clearColor(0.2, 0.4, 0.4, 1)
            this.renderer.clear()

            // Update camera
            if (this.xr.state == XRState.IN_XR && this.xr.display.getFrameData(this.xr.frameData)) {
                this.camera.updateFromFrameData(this.xr.frameData)
            }

            // Render scene
            this.renderer.renderScene(this.camera, this.nodes, this.lights)

            // Blit back to screen
            if (this.xr.state == XRState.IN_XR) {
                this.renderer.setRenderTexture(this.xr.getNextTexture())
            } else {
                this.renderer.setRenderTexture(this.window.getNextTexture())
            }

            // When presenting render a stereo view.
            this.renderer.setViewport(0, 0, this.device.canvasElement.width, this.device.canvasElement.height)
            this.device.gl.clearColor(1.0, 0.4, 0.4, 1)
            this.renderer.clear()

            fullScreenQuadProg.load()
            fullScreenQuadProg.updateUniforms({ debug: this.singleViewDebug });
            fullScreenQuadProg.setTextures({ imgs: this.xr.multiviewTexture })
            fullScreenQuadProg.draw(quad)

            if (this.xr.state == XRState.IN_XR) {
                this.xr.display.submitFrame();
            }
        }


        var currentLoop: null | Loop = new Loop(requestAnimationFrame, gameLoop)

        // Click to enter VR
        // TODO move this somewhere else
        var clickToggle = false
        document.addEventListener("pointerdown", async () => {
            if (this.singleViewDebug) {
                return;
            }
            clickToggle = !clickToggle
            if (!clickToggle) {
                if (currentLoop) {
                    await currentLoop.stop()
                }
                currentLoop = new Loop(requestAnimationFrame, gameLoop)

            } else {
                if (currentLoop) {
                    await currentLoop.stop()
                }
                currentLoop = null
                console.log("TRYING")
                if (await this.xr.canStart()) {
                    console.log("STARTING")
                    await this.xr.start()
                    this.xr.display.depthNear = 0.1;
                    this.xr.display.depthFar = 1024.0;
                    currentLoop = new Loop((x: any) => { this.xr.display.requestAnimationFrame(x) }, gameLoop)
                }
            }
        })
    }
}