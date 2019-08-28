import * as twgl from "twgl.js"

export class Matrix4 {
    m:twgl.m4.Mat4
    constructor(){
        this.m = twgl.m4.identity()
    }
}