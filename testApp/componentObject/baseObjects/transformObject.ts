import { BaseObject } from "./baseObject";
import { TransformComponent } from "../components/transform/transformComponent";

export class TransformObject extends BaseObject {
    transform: TransformComponent
    constructor() {
        super()
        this.transform = new TransformComponent()
        this.addComponent(this.transform)
    }
}