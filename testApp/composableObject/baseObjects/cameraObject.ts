import { TransformObject } from "./transformObject"
import { CameraComponent } from "../components/cameraComponent"
import { XRCamera } from "../../xr/xrCamera"

export class CameraObject extends TransformObject {
    camera: CameraComponent
    constructor() {
        super()
        this.camera = new CameraComponent(new XRCamera())
        this.addComponent(this.camera)
    }
}