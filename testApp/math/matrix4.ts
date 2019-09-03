import * as twgl from "twgl.js"
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class Matrix4 {
    m:twgl.m4.Mat4
    constructor(){
        this.m = twgl.m4.identity()
    }

    setProjection(radFov:number, aspect:number, near:number, far:number){
        twgl.m4.perspective(radFov, aspect, near, far, this.m)
    }

    inverseToRef(result:Matrix4){
        twgl.m4.inverse(this.m, result.m)
    }

    multiplyToRef(mat:Matrix4, result:Matrix4){
        twgl.m4.multiply(this.m, mat.m, result.m)
    }

    compose(pos:Vector3){
        //this.m[]
        twgl.m4.translation(pos.v, this.m)
        //twgl.m4.setTranslation(pos.v, this.m)
       // console.log(this.m)
        //twgl.m4.translate()
    }

    copyToArrayBufferView(copyTo:ArrayBufferView){
        twgl.m4.copy(this.m, copyTo as any)
    }
}