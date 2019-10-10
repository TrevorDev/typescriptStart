import { Component } from "./component";
import { XRCamera } from "../../xr/xrCamera";

export class Camera extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return Camera.type
    }

    constructor(public xrCamera: XRCamera) {
        super()
    }
}