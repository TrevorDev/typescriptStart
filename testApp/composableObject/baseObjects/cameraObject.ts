import { TransformObject } from "./transformObject"
import { Camera } from "../components/camera"
import { XRCamera } from "../../xr/xrCamera"

export class CameraObject extends TransformObject {
    camera: Camera
    constructor() {
        super()
        this.camera = new Camera(new XRCamera())
        this.addComponent(this.camera)
    }
}