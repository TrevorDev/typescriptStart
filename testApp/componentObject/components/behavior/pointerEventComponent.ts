import { Component } from "../component";
import { TransformObject } from "../../baseObjects/transformObject";
import { XRController } from "../../../os/input/xrController";
import { Matrix4 } from "../../../math/matrix4";

export class PointerEventComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    private isHovered = false;
    getType(): number {
        return PointerEventComponent.type
    }
    constructor() {
        super()
    }

    /**
     * Triggers onclick event
     */
    click() {
        this.onClick()
    }
    /**
     * Triggers onHoverChanged only if value is different than the current value
     */
    setHovered(value: boolean) {
        if (this.isHovered != value) {
            this.isHovered = value
            this.onHoverChanged(value)
        }
    }

    onClick = () => { }
    onHoverChanged = (value: boolean) => { }
}