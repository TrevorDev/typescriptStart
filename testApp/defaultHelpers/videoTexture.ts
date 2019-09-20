import { Texture } from "../gpu/texture";
import { GPUDevice } from "../gpu/gpuDevice";

export class VideoTexture {
    texture:Texture
    videoElement:HTMLVideoElement
    constructor(public device:GPUDevice, src="/public/big_buck_bunny.mp4"){
        this.texture =  Texture.createForVideoTexture(device);
        this.videoElement = document.createElement('video');
        this.videoElement.controls = true
        this.videoElement.autoplay = true
        this.videoElement.volume = 0.0
        this.videoElement.src = src
    }

    update(){
        if(this.videoElement.currentTime > 0){
            this.device.gl.bindTexture(this.device.gl.TEXTURE_2D, this.texture.glTexture);
            this.device.gl.texImage2D(this.device.gl.TEXTURE_2D, 0, this.device.gl.RGBA,
            this.device.gl.RGBA, this.device.gl.UNSIGNED_BYTE, this.videoElement)
          }
    }
}