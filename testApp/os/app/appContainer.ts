import { App } from "./app";
import { TransformNode } from "../../sceneGraph/transformNode";
import { Stage } from "../../defaultHelpers/stage";
import { InputManager } from "../input/inputManager";
import { DefaultMesh } from "../../defaultHelpers/defaultMesh";
export class AppContainer {
    app: App
    taskBar: TransformNode
    containerSpace: TransformNode
    constructor(private globalStage: Stage, private inputManager: InputManager) {
        this.containerSpace = new TransformNode()
        //this.containerSpace.position.z = -3
        //this.containerSpace.position.y = 1.2
        globalStage.addNode(this.containerSpace)

        var appSpace = new TransformNode();
        this.app = new App(appSpace)
        this.containerSpace.addChild(appSpace)

        this.taskBar = DefaultMesh.createCube(globalStage.device)
        var taskBarSize = 0.1
        this.taskBar.scale.setScalar(taskBarSize)
        //this.taskBar.position.y -= taskBarSize / 2
        this.containerSpace.addChild(this.taskBar)

        // TODO
        //Dragable.MakeDragable(this.containerSpace, this.inputManager, this.taskBar)
    }

    update(delta: number, curTime: number) {
        this.app.update(delta, curTime)
    }
}