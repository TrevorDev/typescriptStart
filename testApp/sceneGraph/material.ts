import { Camera } from "./camera";
import { Light } from "./light";
import { Mesh } from "./mesh";
import { GPUDevice } from "../gpu/gpuDevice";
import { XRCamera } from "../xr/xrCamera";

export interface Material {
    load():void
    updateFromCamera(camera:XRCamera):void
    updateForLights(lights:Array<Light>):void
    updateUniforms():void
    updateAndDrawForMesh(mesh:Mesh):void
}