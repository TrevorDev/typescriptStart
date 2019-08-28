import { Texture } from "./texture";
import { Color } from "../../math/color";

export class ColorAttachment {
    texture:Texture
    loadAction = "CLEAR"
    clearColor = new Color()
}

export class RenderPassDesc {
    colorAttachments = new Array<ColorAttachment>();
    constructor(){
        this.colorAttachments.push(new ColorAttachment())
    }
}

export class RenderPass {
    
}