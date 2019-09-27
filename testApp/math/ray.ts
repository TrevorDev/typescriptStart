import { Vector3 } from "./vector3";
import { Matrix4 } from "./matrix4";

export class Ray {
    constructor(public origin: Vector3 = new Vector3(0, 0, 0), public direction = new Vector3(0, 0, -1)) {

    }

    applyMatrixToRef(mat: Matrix4, res: Ray) {
        this.origin.rotateByMatrixToRef(mat, res.origin)
        this.direction.transformDirectionToRef(mat, res.direction)
    }
}