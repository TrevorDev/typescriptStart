import { Camera } from "./camera";
import { Light } from "./light";
import { Mesh } from "./mesh";

export interface Material {
    load():void
    updateFromCamera(camera:Camera):void
    updateForLights(lights:Array<Light>):void
    updateUniforms():void
    updateAndDrawForMesh(mesh:Mesh):void
}