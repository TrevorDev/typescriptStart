import { GPUDevice } from "../engine/gpuDevice";
import { Texture } from "../engine/texture";

export class RenderWindow {
    textures = new Array<Texture>()
    constructor(public device:GPUDevice){
        document.body.appendChild(device.canvasElement)
        this.textures.push(new Texture(device))
    }

    onScreenRefreshLoop(fn:Function){
        var loop = ()=>{
            fn()
            requestAnimationFrame(loop)
          }
          requestAnimationFrame(loop)
    }

    getNextTexture(){
        return this.textures[0]
    }
}