import { Vector2, Vector3, Mesh, Scene } from "three";
import { SceneObjectCreator } from "../testApp/niftyOS/stage/sceneObjectCreator";

export class Player {
    vel = new Vector3()
    body:Mesh
    constructor(scene:Scene){
        this.body = SceneObjectCreator.createBox(scene)
        this.body.position.z = -20
    }

    update(delta:number){
        this.body.position.addScaledVector(this.vel, delta)
    }
}