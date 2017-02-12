import $ = require("jquery")
import Vue = require("vue");

import Stage from "../../../objects/stage";
import Controller from "../../../objects/controller";
import Character from "../../../objects/character"
import Block from "../../../objects/block"
import MATERIALS from "../../../libs/materials"
import THREE = require("three")

var main = async ()=>{
  var container = document.getElementById('container')
  var stage = Stage.create(container)

  //lighting
  var ambiant = new THREE.AmbientLight(0xFFFFFF, 0.1);
  stage.scene.add(ambiant);

  var point1 = new THREE.PointLight()
  point1.position.y += 3
  point1.position.z += 3
  stage.scene.add(point1);

  var point2 = new THREE.PointLight()
  point2.position.y += 0
  point2.position.x += 2
  stage.scene.add(point2);

  //skybox
  var skyGeo = new THREE.SphereBufferGeometry( 450000, 32, 15 );
  var skyMesh = new THREE.Mesh( skyGeo, MATERIALS.SKY );
  stage.scene.add( skyMesh );

  //island
  var island = new THREE.Object3D()
  var islandGroundGeo = new THREE.SphereGeometry( 5,5,5, 0, Math.PI, 0, Math.PI );
  var islandGround = new THREE.Mesh( islandGroundGeo, MATERIALS.DEFAULT );
  islandGround.rotation.x = -Math.PI/2
  islandGround.scale.z = 0.5
  island.castShadow = true;
  var treeGeo = new THREE.BoxGeometry( 0.3, 6, 0.3 );
  var treeMesh = new THREE.Mesh( treeGeo, MATERIALS.DEFAULT )
  treeMesh.position.y = 3
  var leafGeo = new THREE.BoxGeometry( 2, 2, 2 );
  var leafMesh = new THREE.Mesh( leafGeo, MATERIALS.LEAF )
  leafMesh.position.y = 3
  treeMesh.add(leafMesh)
  island.add(treeMesh)
  island.add(islandGround)
  island.position.y = -5;
  island.position.z = -10;
  island.position.x = 20;
  stage.scene.add( island );

  //player
	var controller = new Controller({
		up: "w",
		down: "s",
		left: "a",
		right: "d",
		jump: " ",
		rotX: "mouseX",
		rotY: "mouseY",
		click: "mouseLeft"
	})
	var player = new Character(controller);
  stage.scene.add(player.body)

  //walls
  var blocks: Block[] = []
  blocks[0] = new Block(10,10,10)
  blocks[0].body.position.y = -0.5
  blocks[0].update()
  stage.scene.add(blocks[0].body)

  //main loop
  stage.startRender((delta, time)=>{
    player.update()
    blocks.forEach((block)=>{
      var collision = player.collider.intersect(block.collider)
      if(!collision.isEmpty()){
        var overlap = collision.max.clone().sub(collision.min)
        if(overlap.x <= overlap.y && overlap.x <= overlap.z){
          
          player.body.position.x += (player.spd.x >= 0 ? -overlap.x  : overlap.x)
        }else if(overlap.y <= overlap.x && overlap.y <= overlap.z){
          player.body.position.y += (player.spd.y >= 0 ? -overlap.y  : overlap.y)
          player.spd.y=0;
        }else if(overlap.z <= overlap.y && overlap.z <= overlap.x){
          player.body.position.z += (player.spd.z >= 0 ? -overlap.z  : overlap.z)
        }

      }
    })

    stage.camera.position.copy(player.getCameraPos())
		stage.camera.lookAt(player.getCameraLook())
  })
}
$(document).ready(()=>{
  main()
})
