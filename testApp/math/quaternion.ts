import * as twgl from "twgl.js"

export class Quaternion {
    q: number[] | Float32Array
    constructor(x = 0, y = 0, z = 0, w = 1){
        this.q = new Float32Array([x,y,z,w])
    }

    set x(val:number){
        this.q[0]=val;
    }
    set y(val:number){
        this.q[1]=val;
    }
    set z(val:number){
        this.q[2]=val;
    }
    set w(val:number){
        this.q[3]=val;
    }

    get x(){
        return this.q[0];
    }
    get y(){
        return this.q[1];
    }
    get z(){
        return this.q[2];
    }
    get w(){
        return this.q[3];
    }
}