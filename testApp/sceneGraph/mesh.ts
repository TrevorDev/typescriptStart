import { VertexData } from "../gpu/vertexData";
import { Material } from "./material";
import { TransformNode, NodeType } from "./transformNode";

export class Mesh extends TransformNode {
    constructor(public vertData: VertexData, public material: Material) {
        super()
        this.type = NodeType.MESH
    }
}