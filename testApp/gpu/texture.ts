import { GPUDevice } from "./gpuDevice";
import * as twgl from "twgl.js"

export class Texture {
    public glTexture: WebGLTexture | null = null
    public frameBuffer = null
    static createFromeSource(device: GPUDevice, src: Array<number>) {
        // TODO add constructor that sets framebuffer
        var r = new Texture(device)
        r.glTexture = twgl.createTexture(device.gl, {
            min: device.gl.NEAREST,
            mag: device.gl.NEAREST,
            src: src,
        });
        return r
    }

    // const level = 0;
    // const internalFormat = gl.RGBA;
    // const width = 1;
    // const height = 1;
    // const border = 0;
    // const srcFormat = gl.RGBA;
    // const srcType = gl.UNSIGNED_BYTE;
    // const pixel = new Uint8Array([0, 0, 255, 25

    static createForVideoTexture(device: GPUDevice) {
        var r = new Texture(device)
        r.glTexture = twgl.createTexture(device.gl, {
            level: 0,
            width: 1,
            height: 1,
            format: device.gl.RGBA,
            min: device.gl.LINEAR,
            mag: device.gl.LINEAR,
            src: [0, 0, 0, 255],
        });
        return r
    }

    constructor(device: GPUDevice) {
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