import { TransformNode } from "../../sceneGraph/transformNode";
import { Ray } from "../../math/ray";
import { HitResult } from "../../defaultHelpers/hit";

export class App {
    constructor(public scene: TransformNode) {

    }

    castRay(rayCaster: Ray, result: HitResult) {
        result.reset()
    }

    update(delta: number, curTime: number) {

    }

    dispose() {

    }
}