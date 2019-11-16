import { Ray } from "../../math/ray";
import { HitResult } from "../../extensions/hit";
import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { XRController } from "../input/xrController";

export class App {
    constructor(public scene: TransformObject) {

    }

    /**
     * Event for the application to tell the os if controller rays have hit the app
     * @param castingController controller that requesting a ray cast
     * @param result result of the raycast that should be populated based on the raycast
     */
    castRay(castingController: XRController, result: HitResult) {
        result.reset()
    }

    /**
     * Update loop for the app (called every frame) it is the apps responsibility to pause itself by doing nothing if not active
     * @param delta Deltatime in seconds since last update
     * @param curTime Time since os start in seconds
     * @param controllers list of xr controllers
     */
    update(delta: number, curTime: number, controllers: Array<XRController>) {

    }

    /**
     * Even fired when the app is close, the application should clean up all it's resources
     */
    dispose() {

    }
}