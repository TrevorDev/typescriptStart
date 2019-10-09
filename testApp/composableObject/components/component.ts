export abstract class Component {
    static _TYPE_COUNTER = 0;
    static type: number
    object: Object
    constructor() {
    }

    update() {

    }
    abstract getType(): number;
}