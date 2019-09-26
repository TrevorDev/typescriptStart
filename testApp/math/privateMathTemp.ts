import { Matrix4 } from "./matrix4";
import { Vector3 } from "./vector3";
import { Quaternion } from "./quaternion";

/**
 * Warning do not use, this is for internal use only, these may change
 */
export class PMathTemp {
    // Temp
    static _m1: Matrix4
    static get m1() {
        if (!PMathTemp._m1) {
            PMathTemp._m1 = new Matrix4()
        }
        return PMathTemp._m1
    }
    static _v1: Vector3
    static get v1() {
        if (!PMathTemp._v1) {
            PMathTemp._v1 = new Vector3()
        }
        return PMathTemp._v1
    }
    static _q1: Quaternion
    static get q1() {
        if (!PMathTemp._q1) {
            PMathTemp._q1 = new Quaternion()
        }
        return PMathTemp._q1
    }

    // Frozen
    static _vZero: Vector3
    static get vZero() {
        if (!PMathTemp._vZero) {
            PMathTemp._vZero = new Vector3()
        }
        return PMathTemp._vZero
    }
    static _vOne: Vector3
    static get vOne() {
        if (!PMathTemp._vOne) {
            PMathTemp._vOne = new Vector3(1, 1, 1)
        }
        return PMathTemp._vOne
    }
    static _vForward: Vector3
    static get vForward() {
        if (!PMathTemp._vForward) {
            PMathTemp._vForward = new Vector3(0, 0, -1)
        }
        return PMathTemp._vForward
    }
}