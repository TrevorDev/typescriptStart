import { DefaultVertexData } from "./defaultVertexData"
import { GPUDevice } from "../gpu/gpuDevice"
import { CustomProgram } from "../gpu/customProgram"
import { VertexData } from "../gpu/vertexData"
import { MultiviewTexture } from "./multiviewTexture"
import { Shader } from "../gpu/shader"

export class MultiviewBlit {
    public quad: VertexData
    public fullScreenQuadProg: CustomProgram
    constructor(device: GPUDevice) {
        this.quad = DefaultVertexData.createFullScreenQuad(device)
        this.fullScreenQuadProg = new CustomProgram(device, MultiviewBlit.quadVertShader, MultiviewBlit.multiviewBlitToTextureFragShader)
    }

    blit(texture: MultiviewTexture) {
        this.fullScreenQuadProg.load()
        //this.fullScreenQuadProg.updateUniforms({ debug: this.singleViewDebug });
        this.fullScreenQuadProg.setTextures({ imgs: texture })
        this.fullScreenQuadProg.draw(this.quad)
    }

    static quadVertShader = new Shader(`
    #version 300 es
    
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_texcoord;
    
    out mediump vec3 tx;
    
    void main() {
      // const float eye_offset_x[12] = float[12] (
      //     0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      //     1.0, 1.0, 1.0, 1.0, 1.0, 1.0
      // );
    
      tx = a_position.xyz;
    
      const vec2 pos_scale = vec2(0.5, 1.0);
      gl_Position = vec4(((a_position.xy)*pos_scale * 2.0) - 1.0 + vec2(a_position.z, 0), 0.0, 1.0);
    }
          
    `)

    static multiviewBlitToTextureFragShader = new Shader(`
        #version 300 es
        precision mediump float;
    
        uniform float debug;
        uniform mediump sampler2DArray imgs;
        
        in vec4 v_position;
        in vec3 tx;
        
        out vec4 theColor;
        
        void main() {
          theColor = texture(imgs, tx);
        }
          
    `)
}