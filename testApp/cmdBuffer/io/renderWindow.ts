import { GPUDevice } from "../engine/gpuDevice";
import { Texture } from "../engine/texture";

export class RenderWindow {
    textures = new Array<Texture>()
    dimensions = {x:0,y:0}
    constructor(public device:GPUDevice){
        document.body.appendChild(device.canvasElement)
        this.textures.push(new Texture(device))

        this.updateDimensions()
    }

    updateDimensions(){
        this.dimensions.x = this.device.gl.canvas.clientWidth
        this.dimensions.y = this.device.gl.canvas.clientHeight
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