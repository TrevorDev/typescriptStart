export class GPUDevice {
    gl:WebGLRenderingContext
    canvasElement:HTMLCanvasElement
    constructor(){
        this.canvasElement = document.createElement("canvas")
        this.gl = this.canvasElement.getContext("webgl2") as WebGLRenderingContext
        console.log("NiftyRenderer v1.0")
    }
}