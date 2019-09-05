
import * as twgl from "twgl.js"
import { GPUDevice } from "../cmdBuffer/engine/gpuDevice";

export class MultiviewTexture {
    public glTexture:WebGLTexture|null = null
    constructor(device:GPUDevice, width:number, height:number, samples = 4){
        var is_multiview, is_multisampled = false;
        var ext = device.gl.getExtension('OCULUS_multiview');
        if (ext) {
        is_multiview = true;
        is_multisampled = true;
        }
        else {
            ext = device.gl.getExtension('OVR_multiview2');
            if (ext) {
                is_multiview = true;
            }
            else {
                console.log("Neither OCULUS_multiview nor OVR_multiview2 extensions are supported");
                is_multiview = false;
                alert("Multiview not supported")
            }
        }


        var backFbo = device.gl.getParameter(device.gl.FRAMEBUFFER_BINDING);
        var fbo = null;
        var gl = device.gl as any
        if (ext) {
            fbo = device.gl.createFramebuffer();
            device.gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);

            // color texture / attachment
            var colorTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, colorTexture);
            gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, width, height, 2);
            if (!is_multisampled){
                ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, colorTexture, 0, 0, 2);
            }else{
                ext.framebufferTextureMultisampleMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, colorTexture, 0, samples, 0, 2);
            }
           

            // depth texture / attachment
            var depthStencilTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, depthStencilTex);
            gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.DEPTH32F_STENCIL8, width, height, 2);
            if (!is_multisampled){
                ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, depthStencilTex, 0, 0, 2);
            }else{
                ext.framebufferTextureMultisampleMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, depthStencilTex, 0, samples, 0, 2);
            }
            
        }
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, backFbo)

    }
}