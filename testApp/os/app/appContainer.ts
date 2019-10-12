import { App } from "./app";
import { TransformNode } from "../../sceneGraph/transformNode";
import { Stage } from "../../defaultHelpers/stage";
import { InputManager } from "../input/inputManager";
import { DefaultMesh } from "../../defaultHelpers/defaultMesh";
import { TransformObject } from "../../composableObject/baseObjects/transformObject";
import { MeshObject } from "../../composableObject/baseObjects/meshObject";
import { Vector3 } from "../../math/vector3";
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
        var taskBarSize = 0.1
        this.taskBar.transform.scale.setScalar(taskBarSize)
        this.taskBar.transform.rotation.fromEuler(new Vector3(0, 0, Math.PI / 4))
        //this.taskBar.transform.position.y -= taskBarSize / 2
        this.containerSpace.transform.addChild(this.taskBar.transform)
        this.containerSpace.transform.position.y += 1

        // TODO
        //Dragable.MakeDragable(this.containerSpace, this.inputManager, this.taskBar)
    }

    update(delta: number, curTime: number) {
        this.app.update(delta, curTime)
    }
}