import { GPUDevice } from "./gpuDevice";
import { Texture } from "./texture";

export class RenderWindow {
    textures = new Array<Texture>()
    dimensions = { x: 0, y: 0 }
    constructor(public device: GPUDevice, fullscreen = true) {
        document.body.appendChild(device.canvasElement)

        if(fullscreen){
            document.documentElement.style["overflow"]="hidden"
            document.documentElement.style.overflow ="hidden"
            document.documentElement.style.width ="100%"
            document.documentElement.style.height ="100%"
            document.documentElement.style.margin ="0"
            document.documentElement.style.padding ="0"
            document.body.style.overflow ="hidden"
            document.body.style.width ="100%"
            document.body.style.height ="100%"
            document.body.style.margin ="0"
            document.body.style.padding ="0"
            device.canvasElement.style.width = "100%"
            device.canvasElement.style.height = "100%"
        }
        
        
        this.textures.push(new Texture(device))

        this.updateDimensions()
    }

    updateDimensions() {
        this.dimensions.x = (this.device.gl.canvas as HTMLCanvasElement).clientWidth
        this.dimensions.y = (this.device.gl.canvas as HTMLCanvasElement).clientHeight
        this.device.canvasElement.width = this.dimensions.x
        this.device.canvasElement.height = this.dimensions.y
    }

    onScreenRefreshLoop(fn: Function) {
        var loop = () => {
            fn()
            requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
    }

    getNextTexture() {
        return this.textures[0]
    }
}