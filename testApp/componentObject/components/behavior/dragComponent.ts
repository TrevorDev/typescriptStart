import { Component } from "../component";

export class DragComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return DragComponent.type
    }
}