import { BaseObject } from "../baseObjects/baseObject";
import { TransformObject } from "../baseObjects/transformObject";

export abstract class Component {
    static _TYPE_COUNTER = 0;
    static type: number
    object: TransformObject
    constructor() {
    }

    update() {

    }
    onObjectSet() {
    }
    abstract getType(): number;
}