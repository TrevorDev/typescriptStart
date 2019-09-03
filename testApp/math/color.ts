import * as twgl from "twgl.js"
export class Color {
    v:Float32Array
    constructor(r = 0, g = 0, b = 0, a = 1){
        this.v = new Float32Array([r,g,b,a])
    }

    set r(val:number){
        this.v[0]=val;
    }
    set g(val:number){
        this.v[1]=val;
    }
    set b(val:number){
        this.v[2]=val;
    }
    set a(val:number){
        this.v[4]=val;
    }

    get r(){
        return this.v[0];
    }
    get g(){
        return this.v[1];
    }
    get b(){
        return this.v[2];
    }
    get a(){
        return this.v[4];
    }
}