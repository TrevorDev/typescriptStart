import { App } from "./app";
import THREE = require("three");
import { Stage } from "../stage/stage";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import { Dragable } from "../ui/draggable";
import { InputManager } from "../input/inputManager";

export class AppContainer{
    app:App
    constructor(private globalStage:Stage, private inputManager:InputManager){
        var containerSpace = new THREE.Group()
        containerSpace.position.z = -3
        containerSpace.position.y = 1.2
        globalStage.scene.add(containerSpace)

        var appSpace = new THREE.Group();
        this.app = new App(appSpace)
        containerSpace.add(appSpace)
        
        var taskBar = SceneObjectCreator.createBox(globalStage.scene)
        var taskBarSize = 0.1
        taskBar.scale.setScalar(taskBarSize)
        taskBar.position.y -= taskBarSize/2
        containerSpace.add(taskBar)

        Dragable.MakeDragable(containerSpace, this.inputManager, taskBar)
    }

    update(){

    }
}