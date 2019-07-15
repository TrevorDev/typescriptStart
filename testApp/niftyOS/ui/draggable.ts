import { InputManager } from "../input/inputManager";
import { Nullable } from "../types/common";
import { XRController } from "../input/xrController";
import { Matrix4 } from "three";
import { MathHelper } from "../math/mathHelper";

export class Dragable {
    static MakeDragable(obj:THREE.Object3D, input:InputManager){
        var selected = false;
        input.controllers.forEach((c)=>{
            c.primaryButton.onDown.add(()=>{
                if(!selected){
                    console.log("hit")
                    var i = c.raycaster.intersectObject(obj)
                    
                    if(i[0]){
                        console.log("selected")
                        selected = true


                        var oldParent = obj.parent!
                        MathHelper.addAsChildKeepWorldMatrix(obj, c.pointer)


                        // c.pointer.add(obj)
                        c.primaryButton.onUp.addOnce(()=>{
                            console.log("un selected")
                            selected = false
                            //oldParent.add(obj)

                            //var oldParent = obj.parent!
                            MathHelper.addAsChildKeepWorldMatrix(obj, oldParent)
                        })
                    }
                }
            })
            // c.onPrimaryButtonChange.add(()=>{
            //     if(selected !== null && selected !== c){
            //         return
            //     }
            //     if(c.primaryButton.value > 0.7){
            //         selected = c
            //     }


            //     if(selected || c.primaryButton.value ){
            //         return
            //     }                
            //     var i = c.raycaster.intersectObject(obj)
            //     if(i[0]){
            //         selected = true
                   
            //     }
            // })
        })
    }
}