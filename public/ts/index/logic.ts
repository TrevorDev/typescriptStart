import $ = require("jquery")
import Vue = require("vue");

import Stage from "../../../objects/stage";
import MATERIALS from "../../../libs/materials"
import OBJLoader from "../../../threeExtensions/OBJLoader"
import ViveController from "../../../threeExtensions/ViveController"
import THREE = require("three")

var main = async ()=>{
  console.log("start")
  var container = document.getElementById('container')
  var stage = Stage.create(container)

  //lighting
  var ambiant = new THREE.AmbientLight(0xFFFFFF, 0.1);
  stage.scene.add(ambiant);

  // var light = new THREE.PointLight( 0xFFFFFF, 1, 30 );
  // light.position.set( 0, 10, 0 );
  // var lightGeo = new THREE.SphereBufferGeometry( 0.1, 32, 15 );
  // var lightMesh = new THREE.Mesh( lightGeo, MATERIALS.DEFAULT )
  // lightMesh.castShadow = true;
	// lightMesh.receiveShadow = true;
  // lightMesh.position.set( 0, 0.2, 0 );
  // stage.scene.add( lightMesh );
  // light.castShadow = true;
  // stage.scene.add( light );

  var light = new THREE.PointLight( 0xFFFFFF, 10, 10000 );
  light.position.set( 20, 50, -200 );
  var lightGeo = new THREE.SphereBufferGeometry( 20, 32, 15 );
  var lightMesh = new THREE.Mesh( lightGeo, MATERIALS.MOON )
  light.add( lightMesh );
  light.castShadow = true;
  stage.scene.add( light );


  var skyGeo = new THREE.SphereBufferGeometry( 450000, 32, 15 );
  var skyMesh = new THREE.Mesh( skyGeo, MATERIALS.SKY );
  stage.scene.add( skyMesh );
  // var geometry = new THREE.BoxGeometry( 200, 200, 200 );
  // var mesh = new THREE.Mesh( geometry, MATERIALS.DEFAULT )
  // stage.scene.add( mesh );
  //
  // var planeGeom = new THREE.PlaneGeometry(2, 2, 50, 50)
  // var planeMesh = new THREE.Mesh( planeGeom, MATERIALS.DEFAULT )
  // planeMesh.receiveShadow = true;
  // planeMesh.position.y = 0;

  var planeGeom = new THREE.PlaneGeometry(1000, 1000, 50, 50)
  var planeMesh = new THREE.Mesh( planeGeom, MATERIALS.WATER )
  planeMesh.position.y = -4;

  // var geom:any = planeMesh.geometry
  // console.log(geom.vertices[3])
  // geom.vertices[20].z += 3000
  planeMesh.rotateX(-Math.PI/2)
  stage.scene.add( planeMesh );



  var island = new THREE.Object3D()

  var islandGroundGeo = new THREE.SphereGeometry( 5,5,5, 0, Math.PI, 0, Math.PI );
  var islandGround = new THREE.Mesh( islandGroundGeo, MATERIALS.DEFAULT );
  islandGround.rotation.x = -Math.PI/2
  islandGround.scale.z = 0.5
  //island.position.x += 1000;
  island.castShadow = true;


  var treeGeo = new THREE.BoxGeometry( 0.3, 6, 0.3 );
  var treeMesh = new THREE.Mesh( treeGeo, MATERIALS.DEFAULT )
  treeMesh.position.y = 3

  var leafGeo = new THREE.BoxGeometry( 2, 2, 2 );
  var leafMesh = new THREE.Mesh( leafGeo, MATERIALS.LEAF )
  leafMesh.position.y = 3
  //leafMesh.position.x = 1
  treeMesh.add(leafMesh)
  island.add(treeMesh)
  island.add(islandGround)
  island.position.y = -5;
  island.position.z = -10;
  island.position.x = 20;
  stage.scene.add( island );




  var controller1 = new ViveController( 0 );
  controller1.standingMatrix = stage.VRControls.getStandingMatrix();
  stage.scene.add( controller1 );

  var controller2 = new ViveController( 1 );
  controller2.standingMatrix = stage.VRControls.getStandingMatrix();
  stage.scene.add( controller2 );


  var loader = new OBJLoader(undefined);
	loader.setPath( '/public/models/' );
	loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {
		var loader = new THREE.TextureLoader();
		loader.setPath( '/public/models/' );
		var controller = object.children[ 0 ];
		controller.material.map = loader.load( 'onepointfive_texture.png' );
		controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
		controller1.add( object.clone() );
		controller2.add( object.clone() );
	} );

  stage.startRender((delta, time)=>{
    stage.renderer.toneMappingExposure = Math.pow( 0.5, 5.0 );
    island.rotation.x = Math.sin(time/3000)*0.1
    island.rotation.z = Math.sin(time/5000)*0.05
    //MATERIALS.WATER.uniforms.inverseCameraView.value = stage.camera.matrixWorld
    MATERIALS.update(delta)
    controller1.update();
		controller2.update();
  })
}
$(document).ready(()=>{
  main()
})
