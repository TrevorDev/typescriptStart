import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { CameraObject } from "../../componentObject/baseObjects/cameraObject";

export class XRHead extends TransformObject {
    leftEye: CameraObject
    rightEye: CameraObject
    cameras: Array<CameraObject>
    constructor() {
        super()
        this.leftEye = new CameraObject()
        this.rightEye = new CameraObject();
        this.cameras = [this.leftEye, this.rightEye];

        this.cameras.forEach((e) => {
            //  console.log(e)
            e.camera.projection.setProjection(30 * Math.PI / 180, 1, 0.5, 150)
        })
    }

    updateFromFrameData(data: VRFrameData) {

        this.leftEye.camera.projection.copyFromArrayBufferView(data.leftProjectionMatrix)
        this.leftEye.camera.view.copyFromArrayBufferView(data.leftViewMatrix)

        this.rightEye.camera.projection.copyFromArrayBufferView(data.rightProjectionMatrix)
        this.rightEye.camera.view.copyFromArrayBufferView(data.rightViewMatrix)
    }
}