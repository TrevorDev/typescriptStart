import { Component } from "./component";
import { Light as LightSpec } from "../../sceneGraph/light";

export class LightComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return LightComponent.type
    }

    constructor(public lightSpec: LightSpec) {
        super()
    }
}