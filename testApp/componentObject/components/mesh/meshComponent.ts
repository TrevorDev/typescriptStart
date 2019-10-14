import { Component } from "../component";
import { VertexData } from "../../../gpu/vertexData";

export class MeshComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return MeshComponent.type
    }
    visible = true;
    constructor(public vertData: VertexData) {
        super()
    }
}