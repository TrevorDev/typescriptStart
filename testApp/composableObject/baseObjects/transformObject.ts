import { BaseObject } from "./baseObject";
import { Transform } from "../components/transform";

export class TransformObject extends BaseObject {
    transform: Transform
    constructor() {
        super()
        this.transform = new Transform()
        this.addComponent(this.transform)
    }
}