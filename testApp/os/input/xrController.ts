import { TransformNode } from "../../sceneGraph/transformNode";
import { Ray } from "../../math/ray";
import { AppContainer } from "../app/appContainer";

export class XRController extends TransformNode {
    ray = new Ray()
    // TODO move this class to os?
    hoveredApp: null | AppContainer = null

    constructor() {
        super()
    }

    update() {

    }


}