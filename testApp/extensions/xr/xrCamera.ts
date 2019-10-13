import { TransformNode } from "../../sceneGraph/transformNode";
import { Camera } from "../../sceneGraph/camera";

export class XRCamera extends TransformNode {
    leftEye = new Camera()
    rightEye = new Camera()
    eyes = [this.leftEye, this.rightEye]

    constructor() {
        super()
        //console.log(this.eyes)
        this.eyes.forEach((e) => {
            //  console.log(e)
            e.projection.setProjection(30 * Math.PI / 180, 1, 0.5, 150)
        })

    }

    updateFromFrameData(data: VRFrameData) {

        this.leftEye.projection.copyFromArrayBufferView(data.leftProjectionMatrix)
        this.leftEye.view.copyFromArrayBufferView(data.leftViewMatrix)

        this.rightEye.projection.copyFromArrayBufferView(data.rightProjectionMatrix)
        this.rightEye.view.copyFromArrayBufferView(data.rightViewMatrix)
    }
}