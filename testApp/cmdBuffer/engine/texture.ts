import { GPUDevice } from "./gpuDevice";
import * as twgl from "twgl.js"

export class Texture {
    public glTexture:WebGLTexture|null = null
    static createFromeSource(device:GPUDevice, src:Array<number>){
        var r = new Texture(device)
        r.glTexture = twgl.createTexture(device.gl, {
            min: device.gl.NEAREST,
            mag: device.gl.NEAREST,
            src: src,
          }); 
        return r
    }
    constructor(device:GPUDevice){
        // this.glTexture = twgl.createTexture(device.gl, {
        //     min: device.gl.NEAREST,
        //     mag: device.gl.NEAREST,
        //     src: [
        //         255, 255, 255, 255,
        //         192, 192, 192, 255,
        //         192, 192, 192, 255,
        //         255, 255, 255, 255,
        //     ],
        // });
    }
}