import { Component } from "../component";
import { TransformObject } from "../../baseObjects/transformObject";
import { XRController } from "../../../os/input/xrController";
import { Matrix4 } from "../../../math/matrix4";

export class PointerEventComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return PointerEventComponent.type
    }
    constructor() {
        super()
    }

    click() {
        this.onClick()
    }

    onClick = () => { }
}