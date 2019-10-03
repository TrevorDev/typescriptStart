import { TransformNode } from "../../sceneGraph/transformNode";
import { Ray } from "../../math/ray";
import { AppContainer } from "../app/appContainer";
import { Stage } from "../../defaultHelpers/stage";
import { DefaultMesh } from "../../defaultHelpers/defaultMesh";

export class XRController extends TransformNode {
    ray = new Ray()
    // TODO move this class to os?
    hoveredApp: null | AppContainer = null

    constructor(stage: Stage, hand: string) {
        super()
        if (hand == "left") {
            this.getGamepad = () => {
                return stage.xr.leftController
            }
        } else {
            this.getGamepad = () => {
                return stage.xr.rightController
            }
        }
        stage.addNode(this)
        var mesh = DefaultMesh.createCube(stage.device)
        mesh.scale.scaleInPlace(0.05)
        this.addChild(mesh)
    }

    getGamepad(): null | Gamepad {
        return null
    }

    update() {
        var gamepad = this.getGamepad()
        if (gamepad) {
            if (gamepad.pose) {
                if (gamepad.pose.position) {
                    this.position.set(gamepad.pose.position[0], gamepad.pose.position[1], gamepad.pose.position[2])
                }
                if (gamepad.pose.orientation) {
                    this.rotation.set(gamepad.pose.orientation[0], gamepad.pose.orientation[1], gamepad.pose.orientation[2], gamepad.pose.orientation[3])
                }
            }
        }
    }


}