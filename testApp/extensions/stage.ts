import { RenderWindow } from "../gpu/renderWindow";
import { GPUDevice } from "../gpu/gpuDevice";
import { DefaultVertexData } from "./defaultVertexData";
import { Renderer } from "../sceneGraph/renderer";
import { CustomProgram } from "../gpu/customProgram";
import { XR, XRState } from "../xr/xr";
import { Loop } from "../sceneGraph/loop";
import { DefaultShaders } from "./defaultShaders";
import { TransformObject } from "../componentObject/baseObjects/transformObject";
import { CameraObject } from "../componentObject/baseObjects/cameraObject";
import { LightObject } from "../componentObject/baseObjects/lightObject";

export class Stage {
    // Debug flags
    singleViewDebug = false;

    // Initialize device and window
    device: GPUDevice
    xr: XR
    window: RenderWindow
    renderer: Renderer
    camera: CameraObject
    lights = new Array<LightObject>()
    private nodes = new Array<TransformObject>()
    renderLoop: ((deltaTime: number, curTime: number) => void) | null = null

    addNode(node: TransformObject) {
        this.nodes.push(node)
    }
    removeNode(node: TransformObject) {
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
        this.camera = new CameraObject()


        this.lights.push(new LightObject())
        this.lights[0].transform.position.z = 5;
        this.lights[0].transform.position.x = 10;
        this.lights[0].transform.position.y = 10;

        // Custom blit operation used to draw multiview frame into single frame required for webVR
        // TODO remove this after webXR allows submit multiview frames
        var quad = DefaultVertexData.createFullScreenQuad(this.device)
        var fullScreenQuadProg = new CustomProgram(this.device, DefaultShaders.quadVertShader, DefaultShaders.multiviewBlitToTextureFragShader)

        var time = (new Date()).getTime()
        var gameLoop = () => {
            var newTime = (new Date()).getTime()
            var deltaTime = (newTime - time) / 1000;
            time = newTime;

            //this.lights[0].position.y = Math.sin(newTime / 1000) * 20

            // Update camera
            if (this.xr.state == XRState.IN_XR && this.xr.display.getFrameData(this.xr.frameData)) {
                this.camera.camera.xrCamera.updateFromFrameData(this.xr.frameData)
            }

            if (this.renderLoop) {
                this.renderLoop(deltaTime, time)
            }

            // Clear and set viewport
            if (this.xr.state != XRState.IN_XR) {
                this.window.updateDimensions()
            }

            var gl = this.device.gl
            // Render next action to to multiview texture
            this.renderer.setRenderMultiviewTexture(this.xr.multiviewTexture)
            gl.disable(gl.SCISSOR_TEST);

            // Setup viewport and clear
            this.renderer.setViewport(0, 0, this.xr.multiviewTexture.width, this.xr.multiviewTexture.height)
            this.device.gl.clearColor(0.2, 0.4, 0.4, 1)
            this.renderer.clear()

            // Render scene
            this.renderer.renderScene(this.camera.camera.xrCamera, this.nodes, this.lights)
            gl.invalidateFramebuffer(gl.FRAMEBUFFER, [gl.DEPTH_ATTACHMENT]);
            gl.disable(gl.SCISSOR_TEST);
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
        document.onclick = async () => {
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
                    // It's heighly reccommended that you set the near and far planes to
                    // something appropriate for your scene so the projection matricies
                    // WebVR produces have a well scaled depth buffer.
                    this.xr.display.depthNear = 0.1;
                    this.xr.display.depthFar = 1024.0;
                    currentLoop = new Loop((x: any) => { this.xr.display.requestAnimationFrame(x) }, gameLoop)
                }
            }
        }
        // document.addEventListener("pointerdown", async () => {

        // })
    }
}