import { TransformObject } from "./transformObject"
import { LightComponent } from "../components/lightComponent"
import { PointLight } from "../../sceneGraph/pointLight"

export class LightObject extends TransformObject {
    light: LightComponent
    constructor() {
        super()
        this.light = new LightComponent(new PointLight())
        this.addComponent(this.light)
    }
}