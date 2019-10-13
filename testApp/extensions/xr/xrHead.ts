import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { CameraObject } from "../../componentObject/baseObjects/cameraObject";

export class XRHead extends TransformObject {
    leftEye: CameraObject
    rightEye: CameraObject
    constructor() {
        super()
        this.leftEye = new CameraObject()
        this.rightEye = new CameraObject()
    }
}