export abstract class Component {
    static _TYPE_COUNTER = 0;
    static type: number
    constructor() {
    }

    update() {

    }
    abstract getType(): number;
}