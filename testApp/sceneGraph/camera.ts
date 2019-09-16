import { TransformNode } from "./transformNode";
import { Matrix4 } from "../math/matrix4";

export class Camera extends TransformNode {
    projection = new Matrix4()
    view = new Matrix4()

    // lookAt(){

    // }

    // computeViewAndViewProjection(){
    //     // this.worldMatrix.inverseToRef(this.view)
    //     // this.view.inverseToRef(this.viewInverse)
    //     // this.viewR.inverseToRef(this.viewInverseR)

    //     // this.viewInverse.copyFrom(this.view)
    //     // this.viewInverseR.copyFrom(this.viewR)
        

    //     // this.projection.multiplyToRef(this.view, this.viewProjection)
    //     // this.projectionR.multiplyToRef(this.viewR, this.viewProjectionR)
    // }
}