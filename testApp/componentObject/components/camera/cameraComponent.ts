import { Component } from "../component";
import { Matrix4 } from "../../../math/matrix4";

export class CameraComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return CameraComponent.type
    }

    projection = new Matrix4()
    view = new Matrix4()

    constructor() {
        super()
    }
}