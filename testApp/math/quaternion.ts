import * as twgl from "twgl.js"

export class Quaternion {
    q: number[] | Float32Array
    constructor(x = 0, y = 0, z = 0, w = 1){
        this.q = new Float32Array([x,y,z,w])
    }
}