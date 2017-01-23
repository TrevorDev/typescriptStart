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

  // var planeGeom = new THREE.PlaneGeometry(1000, 1000, 50, 50)
  // var planeMesh = new THREE.Mesh( planeGeom, MATERIALS.WATER )
  // planeMesh.position.y = -4;
  //
  // // var geom:any = planeMesh.geometry
  // // console.log(geom.vertices[3])
  // // geom.vertices[20].z += 3000
  // planeMesh.rotateX(-Math.PI/2)
  // stage.scene.add( planeMesh );



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



  //origin
  var originGeo = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
  var originMesh = new THREE.Mesh( originGeo, MATERIALS.DEFAULT )
  stage.scene.add( originMesh );


  var controller1 = new ViveController( 0 );
  controller1.standingMatrix = stage.VRControls.getStandingMatrix();
  stage.scene.add( controller1 );

  var controller2 = new ViveController( 1 );
  controller2.standingMatrix = stage.VRControls.getStandingMatrix();
  stage.scene.add( controller2 );


  var loader = new OBJLoader(undefined);
	loader.setPath( '/public/models/' );
  var realCont:any
	loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {
		var loader = new THREE.TextureLoader();
		loader.setPath( '/public/models/' );
		var controller = object.children[ 0 ];
		controller.material.map = loader.load( 'onepointfive_texture.png' );
		controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
		controller1.add( object.clone() );
    realCont = object.clone()
		controller2.add( realCont );
	} );

  stage.startRender((delta, time)=>{
    stage.renderer.toneMappingExposure = Math.pow( 0.5, 5.0 );
    island.rotation.x = Math.sin(time/3000)*0.1
    island.rotation.z = Math.sin(time/5000)*0.05
    //MATERIALS.WATER.uniforms.inverseCameraView.value = stage.camera.matrixWorld
    MATERIALS.update(delta)
    controller1.update();
		controller2.update();

    // if(controller1.getButtonState("trigger")){
    //
    // }

    if(controller1.getButtonPressedState("trigger") == "down"){
      console.log("hit")
      var tempMatrix = new THREE.Matrix4();
      tempMatrix.getInverse( controller1.matrixWorld );
      originMesh.matrix.premultiply( tempMatrix );
      originMesh.matrix.decompose( originMesh.position, originMesh.quaternion, originMesh.scale );
      controller1.add(originMesh)
    }else if(controller1.getButtonPressedState("trigger") == "up"){
			originMesh.matrix.premultiply( controller1.matrixWorld );
			originMesh.matrix.decompose( originMesh.position, originMesh.quaternion, originMesh.scale );
			stage.scene.add( originMesh );
    }

    //originMesh.position.y += 0.001;

    if(controller2.getButtonPressedState("trigger") == "down"){
      var vector = new THREE.Vector3();
      vector.setFromMatrixPosition( controller2.matrixWorld );
      console.log(vector)


      var size = 0.1;
      var posChange:THREE.Vector3 = vector.clone().sub(originMesh.position);// - new Vector3(size / 2, size / 2, size / 2));

      var matrix = new THREE.Matrix4();
      matrix.extractRotation( originMesh.matrix );
      var forward = (new THREE.Vector3( 0, 0, 1 )).applyMatrix4(matrix)

      var right = (new THREE.Vector3( 1, 0, 0 )).applyMatrix4(matrix)

      var up = (new THREE.Vector3( 0, 1, 0 )).applyMatrix4(matrix)



      var newPos = new THREE.Vector3(
        Math.floor( // devide by size, floor and multiply by size to position on grid
            (
                posChange.dot(right) // get vector on the x axis
                + (size / 2) // add half the size to make point relative to corner of cube
            ) / size
        ) * size,
        //do same as above for other vectors
        Math.floor((posChange.dot(up) + (size / 2)) / size) * size, Math.floor((posChange.dot(forward) + (size / 2)) / size) * size
      );


      // console.log(controller2.position.clone())
      // console.log(controller2.getGamepad().pose.position)
      var newGeo = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
      var newMesh = new THREE.Mesh( newGeo, MATERIALS.DEFAULT )
      //origin.transform.position + (newPos.x * origin.transform.right) + (newPos.y * origin.transform.up) + (newPos.z * origin.transform.forward);
      var added = right.multiplyScalar(newPos.x).add(up.multiplyScalar(newPos.y)).add(forward.multiplyScalar(newPos.z))
      newMesh.position.copy(originMesh.position.clone().add(added))
      newMesh.rotation.setFromRotationMatrix(originMesh.matrix)



      //newMesh. originMesh.rotation.clone();
      stage.scene.add( newMesh );

      // var tempMatrix = new THREE.Matrix4();
      // tempMatrix.getInverse( originMesh.matrixWorld );
      // newMesh.matrix.premultiply( tempMatrix );
      // newMesh.matrix.decompose( newMesh.position, newMesh.quaternion, newMesh.scale );

      //TODO, do i need this?
      newMesh.updateMatrixWorld(true);
      originMesh.updateMatrixWorld(true);
      THREE.SceneUtils.attach(newMesh, stage.scene, originMesh)

      // var tempMatrix = new THREE.Matrix4();
      // tempMatrix.getInverse( originMesh.matrixWorld );
      // newMesh.matrix.premultiply( tempMatrix );
      // newMesh.matrix.decompose( newMesh.position, newMesh.quaternion, newMesh.scale );
      // controller1.add(newMesh)
      //
      // originMesh.add(newMesh)
    }

  })
}
$(document).ready(()=>{
  main()
})
