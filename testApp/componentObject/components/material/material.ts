import { XRCamera } from "../../../extensions/xr/xrCamera";
import { MeshComponent } from "../mesh/meshComponent";
import { LightObject } from "../../baseObjects/lightObject";

export interface Material {
    load(): void
    updateFromCamera(camera: XRCamera): void
    updateForLights(lights: Array<LightObject>): void
    updateUniforms(): void
    updateAndDrawForMesh(mesh: MeshComponent): void
}