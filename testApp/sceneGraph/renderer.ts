import { TransformNode } from "./transformNode";
import { Camera } from "./camera";
import { GPUDevice } from "../cmdBuffer/engine/gpuDevice";
import { Light } from "./light";
import { Mesh } from "./mesh";

export class SceneRenderer {
    constructor(public device:GPUDevice){

    }
    render(camera:Camera, meshes:Array<TransformNode>, lights:Array<Light>){
        camera.computeWorldMatrix()
        camera.computeViewAndViewProjection()

        
        lights.forEach((l)=>{
            l.computeWorldMatrix()
        })

        // TODO recursive do this
        meshes.forEach((m)=>{
            TransformNode.depthFirstIterate(m, (node)=>{
                TransformNode.computeWorldMatrixForTree(node)
                var mesh = node as Mesh
                if(mesh.material){
                    // Load material program
                    mesh.material.load()
                    mesh.material.updateFromCamera(camera)
                    mesh.material.updateForLights(lights)
                    
                    // Load material instance specific data
                    mesh.material.updateUniforms()
                    mesh.material.updateAndDrawForMesh(mesh)
                }
            })
        })

        
    }

    setTexture(texture:any){

    }

    setViewport(x:number,y:number,width:number,height:number){
        this.device.gl.viewport(x,y,width,height);
    }
    
    clear(){
        this.device.gl.enable(this.device.gl.DEPTH_TEST);
        this.device.gl.enable(this.device.gl.CULL_FACE);
        this.device.gl.clear(this.device.gl.COLOR_BUFFER_BIT | this.device.gl.DEPTH_BUFFER_BIT);
    }
}