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
    constructor(private objectToDrag?: TransformObject) {
        super()


    }

    activeController: null | XRController = null
    node = new TransformObject()
    start(controller: XRController) {
        this.objectToDrag = this.objectToDrag ? this.objectToDrag : this.object
        if (this.activeController) {
            return
        }
        this.activeController = controller

        // Update matrix
        var m = new Matrix4()
        controller.transform.computeWorldMatrix()
        this.objectToDrag.transform.computeWorldMatrix()

        // Add child but keep world matrix
        controller.transform.addChild(this.node.transform)
        this.node.transform.setLocalMatrixFromWorldMatrix(this.objectToDrag.transform.worldMatrix)
    }
    update() {
        if (!this.activeController) {
            return
        }

        this.node.transform.computeWorldMatrix()

        this.objectToDrag!.transform.setLocalMatrixFromWorldMatrix(this.node.transform.worldMatrix)
    }
    end() {
        if (!this.activeController) {
            return
        }
        this.activeController = null
    }
    isDragging() {
        return this.activeController != null
    }


}