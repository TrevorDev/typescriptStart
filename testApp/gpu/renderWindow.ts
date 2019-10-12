import { GPUDevice } from "./gpuDevice";
import { Texture } from "./texture";

export class RenderWindow {
    textures = new Array<Texture>()
    dimensions = { x: 0, y: 0 }
    canvasElement: HTMLCanvasElement
    constructor(public device: GPUDevice, fullscreen = true) {
        this.canvasElement = device.canvasElement
        document.body.appendChild(this.canvasElement)

        if (fullscreen) {
            document.documentElement.style["overflow"] = "hidden"
            document.documentElement.style.overflow = "hidden"
            document.documentElement.style.width = "100%"
            document.documentElement.style.height = "100%"
            document.documentElement.style.margin = "0"
            document.documentElement.style.padding = "0"
            document.body.style.overflow = "hidden"
            document.body.style.width = "100%"
            document.body.style.height = "100%"
            document.body.style.margin = "0"
            document.body.style.padding = "0"
            this.canvasElement.style.width = "100%"
            this.canvasElement.style.height = "100%"
        }


        this.textures.push(new Texture(device))

        this.canvasElement.addEventListener("pointerdown", (e) => {
            console.log(e.clientX / this.canvasElement.clientWidth, e.clientY / this.canvasElement.clientHeight)
        })

        this.updateDimensions()
    }

    updateDimensions() {
        this.dimensions.x = (this.device.gl.canvas as HTMLCanvasElement).clientWidth
        this.dimensions.y = (this.device.gl.canvas as HTMLCanvasElement).clientHeight

        this.canvasElement.width = 2432
        this.canvasElement.height = 1344
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