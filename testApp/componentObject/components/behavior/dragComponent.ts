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

        // Compute difference between parent and child world matrix and set as child local matrix
        controller.transform.worldMatrix.inverseToRef(m)
        m.multiplyToRef(this.object.transform.worldMatrix, m)

        // Set child local matrix on node and set it's parent
        m.decompose(this.node.transform.position, this.node.transform.rotation, this.node.transform.scale)
        this.node.transform.computeLocalMatrix()

        // Add child
        controller.transform.addChild(this.node.transform)



        //controller.transform.addChild(this.object.transform)
        // this.object
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