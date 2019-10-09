import { Component } from "./component";
import { VertexData } from "../../gpu/vertexData";

export class Mesh extends Component {
    static type = Component._TYPE_COUNTER++;
    getType(): number {
        return Mesh.type
    }
    constructor(public vertData: VertexData) {
        super()
    }
}