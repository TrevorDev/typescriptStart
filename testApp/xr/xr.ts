import { GPUDevice } from "../cmdBuffer/engine/gpuDevice"
import { MultiviewTexture } from "../sceneGraph/multiviewTexture"

export enum XRState {
    IN_XR,
    NOT_IN_XR
}

export class XR {
    display:VRDisplay
    state = XRState.NOT_IN_XR
    multiviewTexture:MultiviewTexture
    frameData:VRFrameData
    constructor(private gpuDevice:GPUDevice){
        this.multiviewTexture = new MultiviewTexture(gpuDevice, 1920/2, 1080)
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

        this.gpuDevice.canvasElement.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
        this.gpuDevice.canvasElement.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);

        this.frameData= new VRFrameData();
        this.multiviewTexture = new MultiviewTexture(this.gpuDevice, Math.max(leftEye.renderWidth, rightEye.renderWidth), Math.max(leftEye.renderHeight, rightEye.renderHeight))
        this.state = XRState.IN_XR
        
        console.log("DONE START")
    }
}