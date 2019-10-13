import { TransformObject } from "./transformObject"
import { LightComponent } from "../components/light/lightComponent"
import { PointLight } from "../components/light/pointLight"

export class LightObject extends TransformObject {
    light: LightComponent
    constructor() {
        super()
        this.light = new LightComponent(new PointLight())
        this.addComponent(this.light)
    }
}