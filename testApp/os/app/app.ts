import { Ray } from "../../math/ray";
import { HitResult } from "../../extensions/hit";
import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { XRController } from "../input/xrController";

export class App {
    constructor(public scene: TransformObject) {

    }

    castRay(rayCaster: Ray, result: HitResult) {
        result.reset()
    }

    update(delta: number, curTime: number, controllers: Array<XRController>) {

    }

    dispose() {

    }
}