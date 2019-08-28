import { Vector3 } from "../math/vector3";
import { Quaternion } from "../math/quaternion";
import { Matrix4 } from "../math/matrix4";

export class TransformNode {
    position = new Vector3()
    rotation = new Quaternion()
    scale = new Vector3(1,1,1)
    worldMatrix = new Matrix4()
    localMatrix = new Matrix4()
}