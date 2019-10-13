import { Component } from "../component";
import { TransformObject } from "../../baseObjects/transformObject";
import { XRController } from "../../../os/input/xrController";
import { Matrix4 } from "../../../math/matrix4";

export class DragComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return DragComponent.type
    }
    identity = new Matrix4()

    activeController: null | XRController = null
    node = new TransformObject()
    start(controller: XRController) {
        if (this.activeController) {
            return
        }
        this.activeController = controller

        // Update matrix
        var m = new Matrix4()
        controller.transform.computeWorldMatrix()
        this.object.transform.computeWorldMatrix()

        // Add child but keep world matrix
        controller.transform.addChild(this.node.transform)
        this.node.transform.setLocalMatrixFromWorldMatrix(this.object.transform.worldMatrix)
    }
    update() {
        if (!this.activeController) {
            return
        }

        this.node.transform.computeWorldMatrix()

        this.object.transform.setLocalMatrixFromWorldMatrix(this.node.transform.worldMatrix)
    }
    end() {
        if (!this.activeController) {
            return
        }
        this.activeController = null
    }


}