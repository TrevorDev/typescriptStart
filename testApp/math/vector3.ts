import * as twgl from "twgl.js"
import { Matrix4 } from "./matrix4";
import { Quaternion } from "./quaternion";
import { PMathTemp } from "./privateMathTemp";

export class Vector3 {
    v: twgl.v3.Vec3
    constructor(x = 0, y = 0, z = 0) {
        this.v = twgl.v3.create(x, y, z)
    }

    set x(val: number) {
        this.v[0] = val;
    }
    set y(val: number) {
        this.v[1] = val;
    }
    set z(val: number) {
        this.v[2] = val;
    }

    get x() {
        return this.v[0];
    }
    get y() {
        return this.v[1];
    }
    get z() {
        return this.v[2];
    }

    set(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    scaleInPlace(scaleVal: number) {
        this.x *= scaleVal
        this.y *= scaleVal
        this.z *= scaleVal
    }

    copyFrom(from: Vector3) {
        this.set(from.x, from.y, from.z)
    }

    rotateByQuaternionToRef(q: Quaternion, res: Vector3) {
        PMathTemp.m1.compose(PMathTemp.vZero, q, PMathTemp.vOne)
        this.rotateByMatrixToRef(PMathTemp.m1, res)
    }

    rotateByMatrixToRef(m: Matrix4, res: Vector3) {
        var x = this.x, y = this.y, z = this.z;
        var e = m.m;

        var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        res.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        res.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        res.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    }
}

