
import * as twgl from "twgl.js"
import { GPUDevice } from "./gpuDevice";

export class MultiviewTexture {
    public glTexture:WebGLTexture|null = null
    public frameBuffer:any
    constructor(private device:GPUDevice, public width:number, public height:number, private samples = 4){
        var is_multiview, is_multisampled = false;
        var ext = device.gl.getExtension('OCULUS_multiview');
        if (ext) {
        is_multiview = true;
        is_multisampled = true;
        console.log("oc mul")
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
        var gl = device.gl as any
        if (ext) {
            this.frameBuffer = device.gl.createFramebuffer();
            device.gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBuffer);

            // color texture / attachment
            this.glTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.glTexture);
            gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, width, height, 2);
            if (!is_multisampled){
                ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, this.glTexture, 0, 0, 2);
            }else{
                ext.framebufferTextureMultisampleMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, this.glTexture, 0, samples, 0, 2);
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

   // bind(){
        // var gl = this.device.gl
        // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBuffer)
        // var gl = this.device.gl
        // gl.enable(gl.SCISSOR_TEST);
            
        // let projections = [frameData.leftProjectionMatrix, frameData.rightProjectionMatrix];
        // let viewMats = [frameData.leftViewMatrix, frameData.rightViewMatrix];
        // let width = Math.max(leftEye.renderWidth, rightEye.renderWidth);
        // let height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
        // gl.viewport(0, 0, width, height);
        // gl.scissor(0, 0, width, height);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // cubeSea.render(projections, viewMats, stats, /*multiview*/ true);
        
        // // Now we need to copy rendering from the texture2D array into the actual back
        // // buffer to present it on the device
        // gl.invalidateFramebuffer(gl.DRAW_FRAMEBUFFER, [ gl.DEPTH_STENCIL_ATTACHMENT ]);
        
        // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, backFbo);

        // // This function just copies two layers of the texture2D array as side-by-side
        // // stereo into the back buffer.
        // stereoUtil.blit(this.glTexture, 0, 0, 1, 1, width*2, height);


        // gl.disable(gl.SCISSOR_TEST);
  //  }
}