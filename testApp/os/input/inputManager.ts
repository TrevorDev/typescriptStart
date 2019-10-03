import { Stage } from "../../defaultHelpers/stage";
import { XRController } from "./xrController";

export class InputManager {
    controllers: Array<XRController> = []
    constructor(private stage: Stage) {
        this.controllers[0] = new XRController(this.stage, "left")
        this.controllers[1] = new XRController(this.stage, "right")
        // this.controllers[0] = new XRController(this.stage, this.stage.camera, true)
        // this.controllers[1] = new XRController(this.stage, (this.stage.renderer.vr as any).getController(0))
        // this.controllers[2] = new XRController(this.stage, (this.stage.renderer.vr as any).getController(1))

    }

    get mouseXRController() {
        return this.controllers[0];
    }
    get leftXRController() {
        return this.controllers[1];
    }
    get rightXRController() {
        return this.controllers[2];
    }

    update(delta: number, curTime: number) {
        this.controllers.forEach((c) => {
            c.update()
        })
    }
}