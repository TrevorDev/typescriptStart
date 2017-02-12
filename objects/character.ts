import THREE = require("three")
import materials from "../libs/materials"
import Controller from "../objects/controller"

class Character {
  body:THREE.Mesh
  spd:THREE.Vector3
  view:THREE.Vector3 = new THREE.Vector3(0,0,0)
  collider:THREE.Box3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
  moveAcc = 0.01;
  constructor(public controller:Controller){
    this.body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.DEFAULT);
    this.spd = new THREE.Vector3(0,0,0)
  }

  getCameraLook(){
        var height = 1
        var ret = new THREE.Vector3()
        ret.copy(this.body.position)
        ret.y = this.body.position.y+height
        return ret
  }

  getCameraPos(){
        var height = 1
        var ret = this.getCameraLook();
        ret.x += Math.sin(this.view.y) * Math.cos(this.view.x)
        ret.z += Math.cos(this.view.y) * Math.cos(this.view.x)
        ret.y += Math.sin(this.view.x)
        var diff = ret.clone().sub(this.getCameraLook())
        return diff.multiplyScalar(10).add(this.getCameraLook())
  }
  xMouseVal = 0;
  yMouseVal = 0;
  update(){
    var mouoseSpd = 1/700
    //move mouse and limit verticle rotation
    var xChange =  this.xMouseVal - this.controller.getValue("rotX")* mouoseSpd;
    this.xMouseVal = this.controller.getValue("rotX")* mouoseSpd
    var yChange = this.yMouseVal - this.controller.getValue("rotY")* mouoseSpd
    this.yMouseVal = this.controller.getValue("rotY")* mouoseSpd
    this.view.x -= yChange
    if(this.view.x  > Math.PI/2 - 0.1){
      this.view.x = Math.PI/2 - 0.1
    }else if(this.view.x  < -Math.PI/2 + 0.1){
      this.view.x = -Math.PI/2 + 0.1
    }
    this.view.y += xChange

    //gravity
    this.spd.y -= 0.01

    //key input
    var walkDir = new THREE.Vector3()
    if(this.controller.isDown("up")){
      walkDir.x -= Math.sin(this.view.y) * this.moveAcc
      walkDir.z -= Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("down")){
      walkDir.x += Math.sin(this.view.y) * this.moveAcc
      walkDir.z += Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("right")){
      walkDir.z -= Math.sin(this.view.y) * this.moveAcc
      walkDir.x += Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("left")){
      walkDir.z += Math.sin(this.view.y) * this.moveAcc
      walkDir.x -= Math.cos(this.view.y) * this.moveAcc
    }
    if(this.controller.isDown("jump")){
      this.spd.y = 0.3
    }

    //colliison with objects
    this.spd.add(walkDir)


    this.body.position.add(this.spd)
    this.body.rotation.y = this.view.y
    if(this.body.position.y < -1000){
      this.body.position.copy(new THREE.Vector3(0,0,0))
      this.spd.copy(new THREE.Vector3(0,0,0))
    }
    this.collider.setFromObject(this.body)
  }
}

export default Character
