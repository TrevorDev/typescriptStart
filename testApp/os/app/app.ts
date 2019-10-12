import { TransformNode } from "../../sceneGraph/transformNode";
import { Ray } from "../../math/ray";
import { HitResult } from "../../defaultHelpers/hit";
import { TransformObject } from "../../componentObject/baseObjects/transformObject";

export class App {
    constructor(public scene: TransformObject) {

    }

    castRay(rayCaster: Ray, result: HitResult) {
        result.reset()
    }

    update(delta: number, curTime: number) {

    }

    dispose() {

    }
}