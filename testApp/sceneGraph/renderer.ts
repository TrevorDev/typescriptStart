import { TransformNode } from "./transformNode";
import { Camera } from "./camera";
import { GPUDevice } from "../cmdBuffer/engine/gpuDevice";
import { Light } from "./light";

export class SceneRenderer {
    constructor(public device:GPUDevice){

    }
    render(camera:Camera, meshes:Array<TransformNode>, lights:Array<Light>){

    }

    setTexture(texture:any){

    }

    setViewport(x:number,y:number,width:number,height:number){
        this.device.gl.viewport(x,y,width,height);
    }
    clear(){
        this.device.gl.enable(this.device.gl.DEPTH_TEST);
        this.device.gl.enable(this.device.gl.CULL_FACE);
        this.device.gl.clear(this.device.gl.COLOR_BUFFER_BIT | this.device.gl.DEPTH_BUFFER_BIT);
    }
}