import { Component } from "./component";
import { Material as MaterialSpec } from "../../sceneGraph/material";

export class Material extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return Material.type
    }

    constructor(public material: MaterialSpec) {
        super()
    }
}