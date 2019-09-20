import { GPUDevice } from "../gpu/gpuDevice"
import { MultiviewTexture } from "../gpu/multiviewTexture"
import { Texture } from "../gpu/texture"

export enum XRState {
    IN_XR,
    NOT_IN_XR
}

export class XR {
    textures = new Array<Texture>()
    display:VRDisplay
    state = XRState.NOT_IN_XR
    multiviewTexture:MultiviewTexture
    frameData:VRFrameData
    constructor(private gpuDevice:GPUDevice){
        this.multiviewTexture = new MultiviewTexture(gpuDevice, 1920/2, 1080)

        this.textures.push(new Texture(gpuDevice))
    }

    getNextTexture() {
        return this.textures[0]
    }

    async canStart(){
        if(!navigator.getVRDisplays){
            return false
        }
        this.display = (await navigator.getVRDisplays())[0]
        if(!this.display){
            return false
        }
        return true
    }

    async start(){
        console.log("GET DISPLAY")
        this.display = (await navigator.getVRDisplays())[0]
        console.log(this.display)
        await this.display.requestPresent([{source: this.gpuDevice.canvasElement}])
        console.log("PRESENT")
        
        var leftEye = this.display.getEyeParameters('left');
        var rightEye = this.display.getEyeParameters('right');

        var eyeWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth)
        var eyeHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight)
        
        this.gpuDevice.canvasElement.width = eyeWidth * 2;
        this.gpuDevice.canvasElement.height = eyeHeight;

        
        // Currently beleive there is a bug in oculus msaa multiview extension as aa still exists on verticles
        this.frameData= new VRFrameData();
        this.multiviewTexture = new MultiviewTexture(this.gpuDevice, eyeWidth, eyeHeight)
        this.state = XRState.IN_XR
        
        console.log("DONE START")
    }
}