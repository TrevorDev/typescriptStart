export class GPUDevice {
    gl:WebGL2RenderingContext
    canvasElement:HTMLCanvasElement
    constructor(){
        this.canvasElement = document.createElement("canvas")
        this.gl = this.canvasElement.getContext("webgl2") as WebGL2RenderingContext
        console.log("NiftyRenderer v1.0")
    }
}