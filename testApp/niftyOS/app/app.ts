import { Stage } from "../stage/stage";
import { InputManager } from "../input/inputManager";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import { Raycaster, Intersection } from "three";

export class App{
    constructor(public scene:THREE.Group){
        
    }

    castRay(rayCaster:Raycaster):Array<Intersection>{
        return []
    }

    update(delta:number, curTime:number){
        
    }
}