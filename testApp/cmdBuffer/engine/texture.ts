import { GPUDevice } from "./gpuDevice";
import * as twgl from "twgl.js"

export class Texture {
    public glTexture:WebGLTexture|null = null
    public frameBuffer = null
    static createFromeSource(device:GPUDevice, src:Array<number>){
        // TODO add constructor that sets framebuffer
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