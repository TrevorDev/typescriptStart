import { Vector3 } from "../math/vector3";
import { Quaternion } from "../math/quaternion";
import { Matrix4 } from "../math/matrix4";
import { Ray } from "../math/ray";
import { PMathTemp } from "../math/privateMathTemp";

export enum NodeType {
    CAMERA,
    MESH,
    LIGHT,
    NODE
}

export class TransformNode {
    type = NodeType.NODE
    position = new Vector3()
    rotation = new Quaternion()
    scale = new Vector3(1, 1, 1)
    worldMatrix = new Matrix4()
    localMatrix = new Matrix4()

    computeLocalMatrix() {
        this.localMatrix.compose(this.position, this.rotation, this.scale)
    }

    static computeWorldMatrixForTree(root: TransformNode) {
        TransformNode.depthFirstIterate(root, (node) => {
            node.computeWorldMatrix(false)
        })
    }

    static depthFirstIterate(root: TransformNode, fn: (node: TransformNode) => void) {
        fn(root)
        root.getChildren().forEach((c) => {
            this.depthFirstIterate(c, fn)
        })
    }

    computeWorldMatrix(computeParentsFirst = true) {
        this.computeLocalMatrix()
        if (this._parent) {
            if (computeParentsFirst) {
                this._parent.computeWorldMatrix()
            }
            this._parent.worldMatrix.multiplyToRef(this.localMatrix, this.worldMatrix)
        } else {
            this.worldMatrix.copyFrom(this.localMatrix)
        }
    }

    private _children = new Array<TransformNode>()
    private _parent: null | TransformNode = null

    getParent() {
        return this._parent
    }
    getChildren() {
        return this._children
    }

    addChild(node: TransformNode) {
        if (node._parent) {
            node._parent.removeChild(node)
        }
        node._parent = this
        this._children.push(node)
    }
    removeChild(node: TransformNode) {
        var ind = this._children.indexOf(node)
        if (ind > 0) {
            node._parent = null
            this._children.splice(ind, 1)
        }
    }

    forwardToRef(result: Ray) {
        result.origin.copyFrom(this.position)
        result.direction.set(0, 0, -1);
        result.direction.rotateByQuaternionToRef(this.rotation, result.direction)
    }

}