import { App } from "./app";
import { Stage } from "../../extensions/stage";
import { InputManager } from "../input/inputManager";
import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { MeshObject } from "../../componentObject/baseObjects/meshObject";
import { DragComponent } from "../../componentObject/components/behavior/dragComponent";
export class AppContainer {
    app: App
    taskBar: MeshObject
    containerSpace: TransformObject
    constructor(private globalStage: Stage, private inputManager: InputManager) {
        this.containerSpace = new TransformObject()
        //this.containerSpace.position.z = -3
        //this.containerSpace.position.y = 1.2
        globalStage.addNode(this.containerSpace)

        var appSpace = new TransformObject();
        appSpace.transform.position.y = 0.1
        this.app = new App(appSpace)
        this.containerSpace.transform.addChild(appSpace.transform)

        this.taskBar = new MeshObject(globalStage.device)//DefaultMesh.createCube(globalStage.device)
        this.taskBar.addComponent(new DragComponent(this.containerSpace))
        var taskBarSize = 0.1
        this.taskBar.transform.scale.setScalar(taskBarSize)
        //this.taskBar.transform.rotation.fromEuler(new Vector3(0, 0, Math.PI / 4))
        //this.taskBar.transform.position.y -= taskBarSize / 2
        this.containerSpace.transform.addChild(this.taskBar.transform)
        //this.containerSpace.transform.position.y += 0.2

        // TODO
        //Dragable.MakeDragable(this.containerSpace, this.inputManager, this.taskBar)
    }

    update(delta: number, curTime: number) {
        this.app.update(delta, curTime)
    }
}