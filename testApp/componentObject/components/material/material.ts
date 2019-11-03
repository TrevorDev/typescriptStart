import { MeshComponent } from "../mesh/meshComponent";
import { LightObject } from "../../baseObjects/lightObject";
import { CameraObject } from "../../baseObjects/cameraObject";
import { InstanceGroup } from "../../../extensions/instanceGroup";

export interface Material {
    load(): void
    updateFromCamera(cameras: Array<CameraObject>): void
    updateForLights(lights: Array<LightObject>): void
    updateUniforms(): void
    updateAndDrawForMesh(mesh: MeshComponent): void
    updateAndDrawInstanced(ig: InstanceGroup): void
}