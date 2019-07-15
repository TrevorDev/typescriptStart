import { Stage } from "../stage/stage";
import { InputManager } from "../input/inputManager";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";

export class App{
    constructor(localObject:THREE.Group){
        var b = SceneObjectCreator.createBox(localObject)
        b.scale.set(0.1,0.1,0.1)
    }
}