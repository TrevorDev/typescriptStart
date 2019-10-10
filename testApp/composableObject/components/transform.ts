import { Vector3 } from "../../math/vector3"
import { Quaternion } from "../../math/quaternion"
import { Matrix4 } from "../../math/matrix4"
import { Component } from "./component"
import { Ray } from "../../math/ray"

export class Transform extends Component {
    static type = Component._TYPE_COUNTER++
    getType(): number {
        return Transform.type;
    }

    position = new Vector3()
    rotation = new Quaternion()
    scale = new Vector3(1, 1, 1)
    worldMatrix = new Matrix4()
    localMatrix = new Matrix4()

    computeLocalMatrix() {
        this.localMatrix.compose(this.position, this.rotation, this.scale)
    }

    static computeWorldMatrixForTree(root: Transform) {
        Transform.depthFirstIterate(root, (node) => {
            node.computeWorldMatrix(false)
        })
    }

    static depthFirstIterate(root: Transform, fn: (node: Transform) => void) {
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

    private _children = new Array<Transform>()
    private _parent: null | Transform = null

    getParent() {
        return this._parent
    }
    getChildren() {
        return this._children
    }

    addChild(node: Transform) {
        if (node._parent) {
            node._parent.removeChild(node)
        }
        node._parent = this
        this._children.push(node)
    }
    removeChild(node: Transform) {
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