import { Component } from "./component";

export class Drag extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return Drag.type
    }
}