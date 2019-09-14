import { TransformNode } from "./transformNode";
import { Matrix4 } from "../math/matrix4";

export class Camera extends TransformNode {
    frameData:VRFrameData

    projection = new Matrix4()
    view = new Matrix4()
    viewInverse = new Matrix4()
    viewProjection = new Matrix4()
    

    projectionR = new Matrix4()
    viewR = new Matrix4()
    viewInverseR = new Matrix4()
    viewProjectionR = new Matrix4()

    lookAt(){

    }

    computeViewAndViewProjection(){
        // this.worldMatrix.inverseToRef(this.view)
        this.view.inverseToRef(this.viewInverse)
        this.viewR.inverseToRef(this.viewInverseR)

        // this.viewInverse.copyFrom(this.view)
        // this.viewInverseR.copyFrom(this.viewR)
        

        this.projection.multiplyToRef(this.view, this.viewProjection)
        this.projectionR.multiplyToRef(this.viewR, this.viewProjectionR)
    }
}