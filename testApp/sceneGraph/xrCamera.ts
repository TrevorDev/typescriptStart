import { TransformNode } from "./transformNode";
import { Matrix4 } from "../math/matrix4";
import { Camera } from "./camera";

export class XRCamera extends TransformNode {
    leftEye = new Camera()
    rightEye = new Camera()
    
    XRCamera(){   
    }

    updateFromFrameData(data:VRFrameData){
        this.leftEye.projection.copyFromArrayBufferView(data.leftProjectionMatrix)
        this.leftEye.view.copyFromArrayBufferView(data.leftViewMatrix)

        this.rightEye.projection.copyFromArrayBufferView(data.rightProjectionMatrix)
        this.rightEye.view.copyFromArrayBufferView(data.rightViewMatrix)
    }
}