import { NiftyOS } from "../niftyOS";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import THREE = require("three");
import { MathHelper } from "../math/mathHelper";

class Bullet {
    mesh:THREE.Mesh
    vel:THREE.Vector3
    constructor(scene:THREE.Group){
        this.vel = new THREE.Vector3()
        this.mesh = SceneObjectCreator.createBox(scene)
        this.mesh.scale.setScalar(0.1)
    }

    // update(){
    //     this.mesh.position.add(this.vel)
    // }
}

var main = async()=>{
    var os = NiftyOS.GetOS()
    var input = os.getInputManager()
    var app = os.createApp()

    var bulletIndex = 0;
    var bullets = new Array<Bullet>()
    for(var i =0;i<8;i++){
        bullets.push(new Bullet(app.scene))
        bullets[i].mesh.visible = false
    }

   

    // On trigger move/click desktop mouse
    input.controllers.forEach((c)=>{
        c.primaryButton.onDown.add(()=>{
            if(c.hoveredApp == app){
                var bullet = bullets[bulletIndex]
                bulletIndex = (bulletIndex+1)%bullets.length
                var tmpMatrix = new THREE.Matrix4()
                tmpMatrix.getInverse(app.scene.matrixWorld)
                tmpMatrix.multiplyMatrices(tmpMatrix, c.pointer.matrixWorld)
                tmpMatrix.decompose(bullet.mesh.position, bullet.mesh.quaternion, bullet.mesh.scale)
                bullet.mesh.scale.setScalar(0.1)
                bullet.mesh.visible = true 

                MathHelper.getForwardFromMatrix(tmpMatrix, bullet.vel)
            }
        })
    })

    //var tmpVec = new THREE.Vector3()
    app.update = (delta)=>{
        bullets.forEach((b)=>{
            b.mesh.position.addScaledVector(b.vel, delta/300)
        })
    }
    
}
main()