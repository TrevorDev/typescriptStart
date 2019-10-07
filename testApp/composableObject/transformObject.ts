import { Object } from "./object";
import { Transform } from "./components/transform";

export class TransformObject extends Object {
    tranform: Transform
    constructor() {
        super()
        this.tranform = new Transform()
        this.addComponent(this.tranform)
    }
}