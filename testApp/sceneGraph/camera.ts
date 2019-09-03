import { TransformNode } from "./transformNode";
import { Matrix4 } from "../math/matrix4";

export class Camera extends TransformNode {
    projection = new Matrix4()
    view = new Matrix4()
    viewProjection = new Matrix4()

    lookAt(){

    }

    update(){
        this.worldMatrix.inverseToRef(this.view)
        this.projection.multiplyToRef(this.view, this.viewProjection)
        
        //this.viewInverse
    }
}