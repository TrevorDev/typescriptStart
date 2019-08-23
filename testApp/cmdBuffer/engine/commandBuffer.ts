import { RenderPassDesc } from "./renderPass";
import { Texture } from "./texture";
import { RenderEncoder } from "./renderEncorder";
import { GPUDevice } from "./gpuDevice";
import { Vector3 } from "../math/vector3";
import { Color } from "../math/color";

export class GPUCommand {
    constructor(public type:string){}
}

export class GPUPresentCommand extends GPUCommand{
    constructor(public texture:Texture){
        super("PRESENT");
    }
}

export class GPURenderPassStartCMD extends GPUCommand{
    constructor(public renderPassDesc:RenderPassDesc){
        super("RENDERPASS_START");
    }
}

export class GPUSetRenderPipelineStateCMD extends GPUCommand{
    constructor(){
        super("GPUSetRenderPipelineStateCMD");
    }
}

export class GPUSetVertexBufferCMD extends GPUCommand{
    constructor(){
        super("GPUSetVertexBufferCMD");
    }
}
export class GPUSetUniformsCMD extends GPUCommand{
    constructor(){
        super("GPUSetUniformsCMD");
    }
}
export class GPUDrawPrimitivesCMD extends GPUCommand{
    constructor(){
        super("GPUDrawPrimitivesCMD");
    }
}

export class GPUHackedActionCMD extends GPUCommand{
    constructor(public fn:Function){
        super("GPUHackedActionCMD");
    }
}

export class GPUNewCMD extends GPUCommand{
    constructor(){
        super("TODO");
    }
}

export class CommandBuffer {
    commands = new Array<GPUCommand>()

    constructor(public device:GPUDevice){

    }

    makeRenderCommandEncoder(desc: RenderPassDesc){
        this.commands.push(new GPURenderPassStartCMD(desc))
        return new RenderEncoder(this)
    }

    present(drawable:Texture){
        this.commands.push(new GPUPresentCommand(drawable))
    }
    commit(){
        this.device.gl.viewport(0, 0, this.device.gl.canvas.width, this.device.gl.canvas.height);
        this.device.gl.enable(this.device.gl.DEPTH_TEST);
        this.device.gl.enable(this.device.gl.CULL_FACE);

        for(var cmd of this.commands){
            if(cmd.type == "RENDERPASS_START"){
                let c = cmd as GPURenderPassStartCMD
                if(c.renderPassDesc.colorAttachments[0].loadAction == "CLEAR"){
                    this.device.gl.clearColor(c.renderPassDesc.colorAttachments[0].clearColor.r,c.renderPassDesc.colorAttachments[0].clearColor.g,c.renderPassDesc.colorAttachments[0].clearColor.b,c.renderPassDesc.colorAttachments[0].clearColor.a)
                    this.device.gl.clear(this.device.gl.COLOR_BUFFER_BIT | this.device.gl.DEPTH_BUFFER_BIT);
                }
                
            }
            if(cmd.type == "GPUHackedActionCMD"){
                let c = cmd as GPUHackedActionCMD
                c.fn()
            }
            if(cmd.type == "PRESENT"){
            }
        }
        // twgl.resizeCanvasToDisplaySize(gl.canvas);
        // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}