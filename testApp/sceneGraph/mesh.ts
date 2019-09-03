import { VertexData } from "./vertexData";
import { Material } from "./material";
import { TransformNode } from "./transformNode";

export class Mesh extends TransformNode {
    constructor(public vertData:VertexData, public material:Material){
        super()
    }
}