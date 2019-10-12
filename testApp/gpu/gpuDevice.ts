export class GPUDevice {
    gl: WebGL2RenderingContext
    canvasElement: HTMLCanvasElement
    constructor() {
        this.canvasElement = document.createElement("canvas")
        var glAttribs = {
            alpha: true,
            antialias: false,
            stencil: false,
        };
        this.gl = this.canvasElement.getContext("webgl2", glAttribs) as WebGL2RenderingContext
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        console.log("NiftyRenderer v1.0")
    }
}