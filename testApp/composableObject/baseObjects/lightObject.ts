import { TransformObject } from "./transformObject"
import { Light } from "../components/light"
import { PointLight } from "../../sceneGraph/pointLight"

export class LightObject extends TransformObject {
    light: Light
    constructor() {
        super()
        this.light = new Light(new PointLight())
        this.addComponent(this.light)
    }
}