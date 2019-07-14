import * as THREE from "three"
import { Stage } from "../stage/stage";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
export class XRController {
    grip: THREE.Group
    pointer: THREE.Group
    constructor(private stage:Stage, private threeController:THREE.Group){
        this.grip = new THREE.Group()
        this.pointer = new THREE.Group()
        stage.scene.add(this.grip)
        stage.scene.add(this.pointer)

        var box = SceneObjectCreator.createBox(stage.scene)
        box.scale.set(0.1,0.1,0.1)
        this.grip.add(box)
        this.grip.matrixAutoUpdate = false
    }

    update(){
        this.grip.matrix.copy(this.threeController.matrix)
        // this.grip.matrix.copy(this.threeController.matrix)
        // this.grip.applyMatrix()
        //this.grip.applyMatrix(this.threeController.matrix)

        //this.grip.position.copy(this.threeController.position)
        // console.log(this.grip.position.x)
    }

}