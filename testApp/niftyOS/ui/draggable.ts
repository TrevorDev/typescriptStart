import { InputManager } from "../input/inputManager";
import { Nullable } from "../types/common";
import { XRController } from "../input/xrController";
import { Matrix4 } from "three";
import { MathHelper } from "../math/mathHelper";

export class Dragable {
    static MakeDragable(obj:THREE.Object3D, input:InputManager, dragObject = obj){
        var selected = false;
        input.controllers.forEach((c)=>{
            c.primaryButton.onDown.add(()=>{
                if(!selected){
                    var i = c.raycaster.intersectObject(dragObject)
                    if(i[0]){
                        selected = true
                        var oldParent = obj.parent!
                        MathHelper.addAsChildKeepWorldMatrix(obj, c.pointer)
                        c.primaryButton.onUp.addOnce(()=>{
                            selected = false
                            MathHelper.addAsChildKeepWorldMatrix(obj, oldParent)
                        })
                    }
                }
            })
        })
    }
}