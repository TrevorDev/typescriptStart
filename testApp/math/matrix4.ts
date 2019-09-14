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

    transposeToRef(result:Matrix4){
        twgl.m4.transpose(this.m, result.m)
    }

    copyFrom(copyFrom:Matrix4){
        twgl.m4.copy(copyFrom.m, this.m)
    }

    multiplyToRef(mat:Matrix4, result:Matrix4){
        twgl.m4.multiply(this.m, mat.m, result.m)
    }

    compose(position:Vector3, quaternion:Quaternion, scale:Vector3){

        var te = this.m;

		var x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
		var x2 = x + x,	y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		var sx = scale.x, sy = scale.y, sz = scale.z;

		te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
		te[ 1 ] = ( xy + wz ) * sx;
		te[ 2 ] = ( xz - wy ) * sx;
		te[ 3 ] = 0;

		te[ 4 ] = ( xy - wz ) * sy;
		te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
		te[ 6 ] = ( yz + wx ) * sy;
		te[ 7 ] = 0;

		te[ 8 ] = ( xz + wy ) * sz;
		te[ 9 ] = ( yz - wx ) * sz;
		te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
		te[ 11 ] = 0;

		te[ 12 ] = position.x;
		te[ 13 ] = position.y;
		te[ 14 ] = position.z;
		te[ 15 ] = 1;

        //this.m[]
        //twgl.m4.translation(pos.v, this.m)
        //twgl.m4.rot
        //twgl.m4.setTranslation(pos.v, this.m)
       // console.log(this.m)
        //twgl.m4.translate()
    }

    copyToArrayBufferView(copyTo:ArrayBufferView){
        twgl.m4.copy(this.m, copyTo as any)
    }
    copyFromArrayBufferView(copyFrom:Float32Array){
        twgl.m4.copy(copyFrom, this.m)
    }
}