import { Component } from "../component";
import { Material } from "./material";

export class MaterialComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return MaterialComponent.type
    }

    constructor(public material: Material) {
        super()
    }
}