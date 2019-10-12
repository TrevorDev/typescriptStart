import { Camera } from "./camera";
import { Light } from "./light";
import { GPUDevice } from "../gpu/gpuDevice";
import { XRCamera } from "../xr/xrCamera";
import { MeshComponent } from "../componentObject/components/mesh/meshComponent";
import { LightObject } from "../componentObject/baseObjects/lightObject";

export interface Material {
    load(): void
    updateFromCamera(camera: XRCamera): void
    updateForLights(lights: Array<LightObject>): void
    updateUniforms(): void
    updateAndDrawForMesh(mesh: MeshComponent): void
}