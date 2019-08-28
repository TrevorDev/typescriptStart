import * as twgl from "twgl.js"

export class Vector3 {
    v:twgl.v3.Vec3
    constructor(public x = 0, public y = 0, public z = 0){
        this.v = twgl.v3.create(x,y,z)
    }
}

