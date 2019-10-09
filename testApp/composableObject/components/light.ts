import { Component } from "./component";
import { Light as LightSpec } from "../../sceneGraph/light";

export class Light extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return Light.type
    }

    constructor(public lightSpec: LightSpec) {
        super()
    }
}