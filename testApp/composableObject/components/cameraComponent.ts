import { Component } from "./component";
import { XRCamera } from "../../xr/xrCamera";

export class CameraComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return CameraComponent.type
    }

    constructor(public xrCamera: XRCamera) {
        super()
    }
}