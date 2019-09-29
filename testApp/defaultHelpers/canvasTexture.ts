import { Texture } from "../gpu/texture";
import { GPUDevice } from "../gpu/gpuDevice";

export class CanvasTexture {
    texture: Texture
    constructor(public device: GPUDevice, public canvas: HTMLCanvasElement) {
        this.texture = Texture.createForVideoTexture(device);
    }

    update() {
        this.device.gl.bindTexture(this.device.gl.TEXTURE_2D, this.texture.glTexture);
        this.device.gl.texImage2D(this.device.gl.TEXTURE_2D, 0, this.device.gl.RGBA,
            this.device.gl.RGBA, this.device.gl.UNSIGNED_BYTE, this.canvas)
    }
}