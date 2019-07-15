import { App } from "./app";
import THREE = require("three");
import { Stage } from "../stage/stage";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import { Dragable } from "../ui/draggable";
import { InputManager } from "../input/inputManager";

export class AppContainer{
    constructor(private globalStage:Stage, private inputManager:InputManager){
        var appSpace = new THREE.Group();
        var app = new App(appSpace)

        var taskBar = SceneObjectCreator.createBox(globalStage.scene)
        //appSpace.position
        taskBar.add(appSpace)
        appSpace.position.y = 2

        taskBar.position.z = -3

        Dragable.MakeDragable(taskBar, this.inputManager)
    }

    update(){

    }
}