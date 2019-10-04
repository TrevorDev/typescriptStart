import * as twgl from "twgl.js"
import { Vector3 } from "./vector3";
import { Matrix4 } from "./matrix4";

export class Quaternion {
    q: number[] | Float32Array
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.q = new Float32Array([x, y, z, w])
    }

    set x(val: number) {
        this.q[0] = val;
    }
    set y(val: number) {
        this.q[1] = val;
    }
    set z(val: number) {
        this.q[2] = val;
    }
    set w(val: number) {
        this.q[3] = val;
    }

    get x() {
        return this.q[0];
    }
    get y() {
        return this.q[1];
    }
    get z() {
        return this.q[2];
    }
    get w() {
        return this.q[3];
    }

    set(x: number, y: number, z: number, w: number) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    toEulerRef(res: Vector3) {
        var qz = this.z;
        var qx = this.x;
        var qy = this.y;
        var qw = this.w;

        var sqw = qw * qw;
        var sqz = qz * qz;
        var sqx = qx * qx;
        var sqy = qy * qy;

        var zAxisY = qy * qz - qx * qw;
        var limit = .4999999;

        if (zAxisY < -limit) {
            res.y = 2 * Math.atan2(qy, qw);
            res.x = Math.PI / 2;
            res.z = 0;
        } else if (zAxisY > limit) {
            res.y = 2 * Math.atan2(qy, qw);
            res.x = -Math.PI / 2;
            res.z = 0;
        } else {
            res.z = Math.atan2(2.0 * (qx * qy + qz * qw), (-sqz - sqx + sqy + sqw));
            res.x = Math.asin(-2.0 * (qz * qy - qx * qw));
            res.y = Math.atan2(2.0 * (qz * qx + qy * qw), (sqz - sqx - sqy + sqw));
        }
    }

    fromRotationMatrix(m: Matrix4) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var te = m.m,

            m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10],

            trace = m11 + m22 + m33,
            s;

        if (trace > 0) {

            s = 0.5 / Math.sqrt(trace + 1.0);

            this.w = 0.25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;

        } else if (m11 > m22 && m11 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this.w = (m32 - m23) / s;
            this.x = 0.25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;

        } else if (m22 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = 0.25 * s;
            this.z = (m23 + m32) / s;

        } else {

            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = 0.25 * s;

        }
    }

    fromEuler(res: Vector3) {
        // Produces a quaternion from Euler angles in the z-y-x orientation (Tait-Bryan angles)
        var halfRoll = res.z * 0.5;
        var halfPitch = res.x * 0.5;
        var halfYaw = res.y * 0.5;

        var sinRoll = Math.sin(halfRoll);
        var cosRoll = Math.cos(halfRoll);
        var sinPitch = Math.sin(halfPitch);
        var cosPitch = Math.cos(halfPitch);
        var sinYaw = Math.sin(halfYaw);
        var cosYaw = Math.cos(halfYaw);

        this.x = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
        this.y = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
        this.z = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
        this.w = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
    }
}