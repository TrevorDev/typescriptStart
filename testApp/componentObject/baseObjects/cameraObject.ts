import { TransformObject } from "./transformObject"
import { CameraComponent } from "../components/camera/cameraComponent"
import { XRCamera } from "../../extensions/xr/xrCamera"

export class CameraObject extends TransformObject {
    camera: CameraComponent
    constructor() {
        super()
        this.camera = new CameraComponent(new XRCamera())
        this.addComponent(this.camera)
    }
}