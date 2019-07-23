import { App } from "./app";
import THREE = require("three");
import { Stage } from "../stage/stage";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import { Dragable } from "../ui/draggable";
import { InputManager } from "../input/inputManager";
import { Raycaster } from "three";

export class AppContainer{
    app:App
    taskBar:THREE.Object3D
    containerSpace:THREE.Group
    constructor(private globalStage:Stage, private inputManager:InputManager){
        this.containerSpace = new THREE.Group()
        this.containerSpace.position.z = -3
        this.containerSpace.position.y = 1.2
        globalStage.scene.add(this.containerSpace)

        var appSpace = new THREE.Group();
        this.app = new App(appSpace)
        this.containerSpace.add(appSpace)
        
        this.taskBar = SceneObjectCreator.createBox(globalStage.scene)
        var taskBarSize = 0.1
        this.taskBar.scale.setScalar(taskBarSize)
        this.taskBar.position.y -= taskBarSize/2
        this.containerSpace.add(this.taskBar)

        Dragable.MakeDragable(this.containerSpace, this.inputManager, this.taskBar)
    }

    update(delta:number, curTime:number){
        this.app.update(delta, curTime)
    }
}