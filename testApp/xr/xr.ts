import { GPUDevice } from "../cmdBuffer/engine/gpuDevice"

export enum XRState {
    IN_XR,
    NOT_IN_XR
}

export class XR {
    display:VRDisplay
    state = XRState.NOT_IN_XR
    constructor(private gpuDevice:GPUDevice){

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
        this.display = (await navigator.getVRDisplays())[0]
        await this.display.requestPresent([{source: this.gpuDevice.canvasElement}])

        var leftEye = this.display.getEyeParameters('left');
        var rightEye = this.display.getEyeParameters('right');

        this.gpuDevice.canvasElement.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
        this.gpuDevice.canvasElement.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
        this.state = XRState.IN_XR
    }
}