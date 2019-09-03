import { Vector3 } from "../math/vector3";
import { Quaternion } from "../math/quaternion";
import { Matrix4 } from "../math/matrix4";

export class TransformNode {
    position = new Vector3()
    rotation = new Quaternion()
    scale = new Vector3(1,1,1)
    worldMatrix = new Matrix4()
    localMatrix = new Matrix4()

    private _children = new Array<TransformNode>()
    private _parent:null | TransformNode = null

    getParent(){
        return this._parent
    }
    getChildren(){
        return this._children
    }

    addChild(node:TransformNode){
        if(node._parent){
            node._parent.removeChild(node)
        }
        node._parent = this
        this._children.push(node)
    }
    removeChild(node:TransformNode){
        var ind = this._children.indexOf(node)
        if(ind > 0){
            node._parent = null
            this._children.splice(ind, 1)
        }
    }
    
}