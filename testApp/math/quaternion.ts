import * as twgl from "twgl.js"
import { Vector3 } from "./vector3";

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