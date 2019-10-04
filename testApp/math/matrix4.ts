import * as twgl from "twgl.js"
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

export class Matrix4 {
    static _tmp0 = new Matrix4()

    m: twgl.m4.Mat4
    constructor() {
        this.m = twgl.m4.identity()
    }

    setProjection(radFov: number, aspect: number, near: number, far: number) {
        twgl.m4.perspective(radFov, aspect, near, far, this.m)
    }

    inverseToRef(result: Matrix4) {
        twgl.m4.inverse(this.m, result.m)
    }

    transposeToRef(result: Matrix4) {
        twgl.m4.transpose(this.m, result.m)
    }

    copyFrom(copyFrom: Matrix4) {
        twgl.m4.copy(copyFrom.m, this.m)
    }

    multiplyToRef(mat: Matrix4, result: Matrix4) {
        twgl.m4.multiply(this.m, mat.m, result.m)
    }

    compose(position: Vector3, quaternion: Quaternion, scale: Vector3) {

        var te = this.m;

        var x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
        var x2 = x + x, y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;

        var sx = scale.x, sy = scale.y, sz = scale.z;

        te[0] = (1 - (yy + zz)) * sx;
        te[1] = (xy + wz) * sx;
        te[2] = (xz - wy) * sx;
        te[3] = 0;

        te[4] = (xy - wz) * sy;
        te[5] = (1 - (xx + zz)) * sy;
        te[6] = (yz + wx) * sy;
        te[7] = 0;

        te[8] = (xz + wy) * sz;
        te[9] = (yz - wx) * sz;
        te[10] = (1 - (xx + yy)) * sz;
        te[11] = 0;

        te[12] = position.x;
        te[13] = position.y;
        te[14] = position.z;
        te[15] = 1;

        //this.m[]
        //twgl.m4.translation(pos.v, this.m)
        //twgl.m4.rot
        //twgl.m4.setTranslation(pos.v, this.m)
        // console.log(this.m)
        //twgl.m4.translate()
    }

    decompose(position?: Vector3, quaternion?: Quaternion, scale?: Vector3) {
        var te = this.m;

        var sx = Vector3._tmp0.set(te[0], te[1], te[2]).length();
        var sy = Vector3._tmp0.set(te[4], te[5], te[6]).length();
        var sz = Vector3._tmp0.set(te[8], te[9], te[10]).length();

        // if determine is negative, we need to invert one scale
        var det = this.determinant();
        if (det < 0) sx = - sx;

        if (position) {
            position.x = te[12];
            position.y = te[13];
            position.z = te[14];
        }


        // scale the rotation part
        Matrix4._tmp0.copyFrom(this);

        var invSX = 1 / sx;
        var invSY = 1 / sy;
        var invSZ = 1 / sz;

        Matrix4._tmp0.m[0] *= invSX;
        Matrix4._tmp0.m[1] *= invSX;
        Matrix4._tmp0.m[2] *= invSX;

        Matrix4._tmp0.m[4] *= invSY;
        Matrix4._tmp0.m[5] *= invSY;
        Matrix4._tmp0.m[6] *= invSY;

        Matrix4._tmp0.m[8] *= invSZ;
        Matrix4._tmp0.m[9] *= invSZ;
        Matrix4._tmp0.m[10] *= invSZ;

        if (quaternion) {
            quaternion.fromRotationMatrix(Matrix4._tmp0);
        }

        if (scale) {
            scale.x = sx;
            scale.y = sy;
            scale.z = sz;
        }

    }
    determinant() {
        var te = this.m;

        var n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
        var n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
        var n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
        var n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

        //TODO: make this more efficient
        //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

        return (
            n41 * (
                + n14 * n23 * n32
                - n13 * n24 * n32
                - n14 * n22 * n33
                + n12 * n24 * n33
                + n13 * n22 * n34
                - n12 * n23 * n34
            ) +
            n42 * (
                + n11 * n23 * n34
                - n11 * n24 * n33
                + n14 * n21 * n33
                - n13 * n21 * n34
                + n13 * n24 * n31
                - n14 * n23 * n31
            ) +
            n43 * (
                + n11 * n24 * n32
                - n11 * n22 * n34
                - n14 * n21 * n32
                + n12 * n21 * n34
                + n14 * n22 * n31
                - n12 * n24 * n31
            ) +
            n44 * (
                - n13 * n22 * n31
                - n11 * n23 * n32
                + n11 * n22 * n33
                + n13 * n21 * n32
                - n12 * n21 * n33
                + n12 * n23 * n31
            )

        );
    }

    copyToArrayBufferView(copyTo: ArrayBufferView) {
        twgl.m4.copy(this.m, copyTo as any)
    }
    copyFromArrayBufferView(copyFrom: Float32Array) {
        twgl.m4.copy(copyFrom, this.m)
    }
}