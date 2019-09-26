import { Vector3 } from "./vector3";

export class Ray {
    constructor(public origin: Vector3 = new Vector3(0, 0, 0), public direction = new Vector3(0, 0, -1)) {

    }
}