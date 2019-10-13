import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { CameraObject } from "../../componentObject/baseObjects/cameraObject";
import { Matrix4 } from "../../math/matrix4";
import { Vector3 } from "../../math/vector3";

export class XRHead extends TransformObject {
    leftEye: CameraObject
    rightEye: CameraObject
    cameras: Array<CameraObject>
    tmpMat = new Matrix4()
    tmpMatB = new Matrix4()
    constructor() {
        super()
        this.leftEye = new CameraObject()
        this.rightEye = new CameraObject();
        this.cameras = [this.leftEye, this.rightEye];

        this.cameras.forEach((e) => {
            //  console.log(e)
            e.camera.projection.setProjection(30 * Math.PI / 180, 1, 0.5, 150)
            this.transform.addChild(e.transform)
        })
    }

    updateFromFrameData(data: VRFrameData) {
        if (data.pose.position) {
            this.transform.position.set(data.pose.position[0], data.pose.position[1], data.pose.position[2])
        }
        if (data.pose.orientation) {
            this.transform.rotation.set(data.pose.orientation[0], data.pose.orientation[1], data.pose.orientation[2], data.pose.orientation[3])
        }
        this.transform.computeWorldMatrix()


        this.leftEye.camera.projection.copyFromArrayBufferView(data.leftProjectionMatrix)
        this.rightEye.camera.projection.copyFromArrayBufferView(data.rightProjectionMatrix)

        // LEFT EYE ------------------------------------------------------------------------------------------------------------
        // compute device space matrix of eye
        this.tmpMat.copyFromArrayBufferView(data.leftViewMatrix)
        this.tmpMat.inverseToRef(this.tmpMat)

        // compute eye relative to head
        this.transform.localMatrix.inverseToRef(this.tmpMatB)
        this.tmpMat.multiplyToRef(this.tmpMatB, this.tmpMatB)

        // Set view
        this.leftEye.transform.localMatrix.copyFrom(this.tmpMatB)
        this.leftEye.transform.localMatrix.decompose(this.leftEye.transform.position, this.leftEye.transform.rotation, this.leftEye.transform.scale)
        this.leftEye.transform.computeWorldMatrix()
        this.leftEye.transform.worldMatrix.inverseToRef(this.leftEye.camera.view)

        // RIGHT EYE ------------------------------------------------------------------------------------------------------------
        // compute device space matrix of eye
        this.tmpMat.copyFromArrayBufferView(data.rightViewMatrix)
        this.tmpMat.inverseToRef(this.tmpMat)

        // compute eye relative to head
        this.transform.localMatrix.inverseToRef(this.tmpMatB)
        this.tmpMat.multiplyToRef(this.tmpMatB, this.tmpMatB)

        // Set view
        this.rightEye.transform.localMatrix.copyFrom(this.tmpMatB)
        this.rightEye.transform.localMatrix.decompose(this.rightEye.transform.position, this.rightEye.transform.rotation, this.rightEye.transform.scale)
        this.rightEye.transform.computeWorldMatrix()
        this.rightEye.transform.worldMatrix.inverseToRef(this.rightEye.camera.view)
    }

    updateViewMatrixForCameras() {
        this.leftEye.transform.computeWorldMatrix()
        this.leftEye.transform.worldMatrix.inverseToRef(this.leftEye.camera.view)

        this.rightEye.transform.computeWorldMatrix()
        this.rightEye.transform.worldMatrix.inverseToRef(this.rightEye.camera.view)
    }
}