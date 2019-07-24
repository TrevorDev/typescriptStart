import { NiftyOS } from "../niftyOS";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import THREE = require("three");
import { MathHelper } from "../math/mathHelper";

class Bullet {
    mesh:THREE.Mesh
    vel:THREE.Vector3
    constructor(scene:THREE.Group){
        this.vel = new THREE.Vector3()

        var geo = new THREE.SphereGeometry(1, 16, 16)
        var mat = new THREE.MeshLambertMaterial({
            //map: new THREE.TextureLoader().load('/public/img/target.png')
        })
		var mesh = new THREE.Mesh(geo, mat )
        mesh.scale.setScalar(0.01)
		scene.add( mesh );


        this.mesh = mesh
    }
}

class Target {
    mesh:THREE.Mesh
    constructor(scene:THREE.Group){
        var geo = new THREE.SphereGeometry(1, 16, 16)
        var mat = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/public/img/target.png')
        })
		var mesh = new THREE.Mesh(geo, mat )
		scene.add( mesh );
        this.mesh = mesh
        this.mesh.scale.setScalar(0.1)
    }
    move(){
        this.mesh.position.set(Math.random()*2-1,Math.random()*2, 0)
    }
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

    var targets = new Array<Target>()
    for(var i =0;i<3;i++){
        targets.push(new Target(app.scene))
        targets[i].move()
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
                bullet.mesh.scale.setScalar(0.01)
                bullet.mesh.visible = true 

                MathHelper.getForwardFromMatrix(tmpMatrix, bullet.vel)
            }
        })
    })

    var tmpVec = new THREE.Vector3()
    app.update = (delta)=>{
        bullets.forEach((b)=>{
            b.mesh.position.addScaledVector(b.vel, delta/300)

            targets.forEach((t)=>{
                tmpVec.copy(t.mesh.position)
                tmpVec.sub(b.mesh.position)
                if(tmpVec.length() < 0.1){
                    t.move()
                    b.mesh.visible = false
                }
            })
        })
    }
    
}
main()