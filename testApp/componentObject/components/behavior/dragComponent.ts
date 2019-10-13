import { Component } from "../component";
import { TransformObject } from "../../baseObjects/transformObject";
import { XRController } from "../../../os/input/xrController";
import { Matrix4 } from "../../../math/matrix4";

export class DragComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return DragComponent.type
    }

    node = new TransformObject()
    start(controller: XRController) {
        var m = new Matrix4()
        controller.transform.computeWorldMatrix()
        this.object.transform.computeWorldMatrix()

        controller.transform.worldMatrix.inverseToRef(m)
        m.multiplyToRef(this.object.transform.worldMatrix, m)
        m.decompose(this.object.transform.position, this.object.transform.rotation, this.object.transform.scale)
        this.object.transform.computeLocalMatrix()

        controller.transform.addChild(this.object.transform)



        //controller.transform.addChild(this.object.transform)
        // this.object
    }
    update() {

    }
    end() {

    }


}