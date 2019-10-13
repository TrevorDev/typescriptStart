import { TransformObject } from "./transformObject"
import { CameraComponent } from "../components/camera/cameraComponent"

export class CameraObject extends TransformObject {
    camera: CameraComponent
    constructor() {
        super()
        this.camera = new CameraComponent()
        this.addComponent(this.camera)
    }
}