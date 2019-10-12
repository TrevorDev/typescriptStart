import { GPUDevice } from "../gpu/gpuDevice"
import { MultiviewTexture } from "../gpu/multiviewTexture"
import { Texture } from "../gpu/texture"

export enum XRState {
    IN_XR,
    NOT_IN_XR
}

export class XR {
    textures = new Array<Texture>()
    display: VRDisplay
    state = XRState.NOT_IN_XR
    multiviewTexture: MultiviewTexture
    frameData: VRFrameData
    leftControllerIndex: number | null = null
    rightControllerIndex: number | null = null
    get leftController() {
        if (this.leftControllerIndex == null) {
            return null;
        }
        return navigator.getGamepads()[this.leftControllerIndex]
    }
    get rightController() {
        if (this.rightControllerIndex == null) {
            return null;
        }
        return navigator.getGamepads()[this.rightControllerIndex]
    }
    constructor(private gpuDevice: GPUDevice) {
        this.multiviewTexture = new MultiviewTexture(gpuDevice, 2432 / 2, 1344)

        this.textures.push(new Texture(gpuDevice))

        window.addEventListener('gamepadconnected', (e) => {
            console.log("connected")
            console.log(e)
            var gamepad = (e as any).gamepad
            if (gamepad.hand == "right") {
                this.rightControllerIndex = gamepad.index
            } else {
                this.leftControllerIndex = gamepad.index
            }
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log("disconnected")
            console.log(e)
            var gamepad = (e as any).gamepad
            if (gamepad.hand == "right") {
                this.rightControllerIndex = null
            } else {
                this.leftControllerIndex = null
            }
        });
    }

    getNextTexture() {
        return this.textures[0]
    }

    async canStart() {
        if (!navigator.getVRDisplays) {
            return false
        }
        this.display = (await navigator.getVRDisplays())[0]
        if (!this.display) {
            return false
        }
        return true
    }

    async start() {
        console.log("GET DISPLAY")
        this.display = (await navigator.getVRDisplays())[0]
        console.log(this.display)

        console.log("PRESENT")

        var leftEye = this.display.getEyeParameters('left');
        var rightEye = this.display.getEyeParameters('right');

        var eyeWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth) * ((true) ? 1 : 2);
        var eyeHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight)

        console.log("new size: " + eyeWidth + "x" + eyeHeight)

        this.gpuDevice.canvasElement.width = eyeWidth * 2;
        this.gpuDevice.canvasElement.height = eyeHeight;

        console.log()


        // Currently beleive there is a bug in oculus msaa multiview extension as aa still exists on verticles
        this.frameData = new VRFrameData();
        // this.multiviewTexture = new MultiviewTexture(this.gpuDevice, eyeWidth, eyeHeight)
        this.state = XRState.IN_XR

        await this.display.requestPresent([{ source: this.gpuDevice.canvasElement }])

        console.log("DONE START")
    }
}