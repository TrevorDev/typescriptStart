import * as twgl from "twgl.js"

export class Vector3 {
    v:twgl.v3.Vec3
    constructor(x = 0, y = 0, z = 0){
        this.v = twgl.v3.create(x,y,z)
    }

    set x(val:number){
        this.v[0]=val;
    }
    set y(val:number){
        this.v[1]=val;
    }
    set z(val:number){
        this.v[2]=val;
    }

    get x(){
        return this.v[0];
    }
    get y(){
        return this.v[1];
    }
    get z(){
        return this.v[2];
    }

    scaleInPlace(scaleVal:number){
        this.x*=scaleVal
        this.y*=scaleVal
        this.z*=scaleVal
    }
}

