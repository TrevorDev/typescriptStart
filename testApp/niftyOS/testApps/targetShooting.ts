import { NiftyOS } from "../niftyOS";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import THREE = require("three");

var main = async()=>{
    var os = NiftyOS.GetOS()
    var input = os.getInputManager()
    var app = os.createApp()

    var box = SceneObjectCreator.createBox(app.scene)
    box.scale.setScalar(0.1)

    // On trigger move/click desktop mouse
    input.controllers.forEach((c)=>{
        c.primaryButton.onDown.add(()=>{
            


            var tmpMatrix = new THREE.Matrix4()

            tmpMatrix.getInverse(app.scene.matrixWorld)
            tmpMatrix.multiplyMatrices(tmpMatrix, c.pointer.matrixWorld)
            tmpMatrix.decompose(box.position, box.quaternion, box.scale)
            box.scale.setScalar(0.1)
            // box.position.z = -0.4
            //app.scene.matrixWorld
            
        })
    })
}
main()