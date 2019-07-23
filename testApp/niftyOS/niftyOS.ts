import { Stage } from "./stage/stage";
import { SceneObjectCreator } from "./stage/sceneObjectCreator";
import { InputManager } from "./input/inputManager";
import * as THREE from "three"
import * as GLTFLoader from "three-gltf-loader"
import { AppContainer } from "./app/appContainer";
import { AppManager } from "./app/appManager";
import { App } from "./app/app";

export class NiftyOS {
	static GetOS(){
		var global = window as any;
    	return global._niftyOS as NiftyOS;
	}

	private globalStage:Stage
	private inputManager:InputManager;
	private appManager:AppManager
	constructor(divContainer:HTMLDivElement){
		this.globalStage = new Stage(divContainer)
		
		// Setup world
		SceneObjectCreator.createDefaultLights(this.globalStage.scene)
		//SceneObjectCreator.createFloor(this.globalStage.scene)
		// var b=SceneObjectCreator.createBox(this.globalStage.scene)
		// b.position.z = -10

		this.inputManager = new InputManager(this.globalStage)
		this.inputManager.controllers.forEach((c)=>{
			c.onMove.add(()=>{

			})
		})

		this.appManager = new AppManager(this.globalStage, this.inputManager)

		//this.appManager.createApp()

		
		// Main render loop
		this.globalStage.startRenderLoop((delta, curTime)=>{
			this.inputManager.update(delta, curTime)

			this.inputManager.controllers.forEach((controller)=>{
				var closestHit = {distance: Infinity} as THREE.Intersection
				var isTaskBar = false
				this.appManager.appContainers.forEach((container)=>{
					var hit = controller.raycaster.intersectObject(container.taskBar)
					if(hit[0] && hit[0].distance < closestHit.distance){
						closestHit = hit[0]
						isTaskBar = true
						controller.hoveredApp = container.app
					}
					hit = container.app.castRay(controller.raycaster)
					if(hit[0] && hit[0].distance < closestHit.distance){
						closestHit = hit[0]
						isTaskBar = false
						controller.hoveredApp = container.app
					}
				})
				controller.hoveredIntersection = closestHit.distance < Infinity ? closestHit : null
			})

			this.appManager.update(delta, curTime)
		})

		this.setGlobal()

		console.log(GLTFLoader)
		const loader = new (GLTFLoader as any)();
		loader.load(
			'/public/gltf/world.glb',
			( gltf:any ) => {
				// called when the resource is loaded
				this.globalStage.scene.add( gltf.scene );
				
				
				(gltf.scene as THREE.Object3D).scale.setScalar(32);
				(gltf.scene as THREE.Object3D).position.y = -3;
				(gltf.scene as THREE.Object3D).position.z = -24;
				(gltf.scene as THREE.Object3D).position.x = -1;
				(gltf.scene as THREE.Object3D).rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
				document.onkeydown = ()=>{
					
					(gltf.scene as THREE.Object3D).position.x--
				}
			},
			( xhr:any ) => {
				// called while loading is progressing
				console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
			},
			( error:any ) => {
				// called when loading has errors
				console.error( 'An error happened', error );
			},
		);

		console.log("NiftyOS v0.0.1")

		require("../niftyOS/testApps/showCase")
		require("../niftyOS/testApps/targetShooting")
		require("../niftyOS/testApps/clock")
	}

	private setGlobal(){
		var global = window as any;
    	global._niftyOS = this
	}

	appPos = 0

	createApp(){
		var container = this.appManager.createApp()
		container.containerSpace.position.x = this.appPos
		this.appPos++
		return container.app
	}
	getInputManager(){
		return this.inputManager
	}


}

// import Stage from "./stage/stage"
// import sceneObjectCreator from "./stage/sceneObjectCreator"
// import App from "./app/app"
// import AppContainer from "./app/appContainer"
// import THREE = require("three")
// import $ = require("jquery")
// import WebVRController from "./input/webVRController"
// class NiftyOS{
// 	private apps:Array<AppContainer> = []
// 	//private buttons:Array<any> = []
// 	private globalStage:Stage
// 	private controllers:{left:WebVRController, right:WebVRController}
// 	private lastLeftPos = {pos: new THREE.Vector3(), rot: new THREE.Quaternion()}
// 	public libs = {
// 		THREE: THREE,
// 		$: $
// 	}
// 	constructor(){
// 		//init OS
// 		var container = document.getElementById('container')
// 		this.globalStage = Stage.create(container, {enableVR: true})

// 		//default world
// 		var sky = sceneObjectCreator.createSkybox(this.globalStage)

// 		var lights = sceneObjectCreator.createLights(this.globalStage)
// 		sceneObjectCreator.createLand(this.globalStage)

// 		//Controllers
// 		this.controllers = sceneObjectCreator.createVRControllers(this.globalStage)
// 		var leftControllerMesh = sceneObjectCreator.createController(this.globalStage)
// 		var rightControllerMesh = sceneObjectCreator.createController(this.globalStage)

// 		//Create ray from controller
// 		var geometry = new THREE.Geometry();
// 		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
// 		geometry.vertices.push( new THREE.Vector3( 0, 0, - 1 ) );
// 		var line = new THREE.Line( geometry );
// 		line.name = 'line';
// 		line.scale.z = 5;
// 		this.globalStage.scene.add(line)

// 		this.globalStage.startRender((delta, time)=>{
// 			//Update controllers and head
// 			this.controllers.left.update()
// 	    	this.controllers.right.update()
// 	    	leftControllerMesh.position.copy(this.controllers.left.position)
// 	    	leftControllerMesh.quaternion.copy(this.controllers.left.quaternion)
// 	    	rightControllerMesh.position.copy(this.controllers.right.position)
// 	    	rightControllerMesh.quaternion.copy(this.controllers.right.quaternion)

// 			this.globalStage.camera.position.copy(this.globalStage.trackedVR.head.position.clone())
// 	    	this.globalStage.camera.quaternion.copy(this.globalStage.trackedVR.head.quaternion.clone())

// 	    	//controller ray
// 	    	line.position.copy(this.controllers.left.position)
// 	    	line.quaternion.copy(this.controllers.left.quaternion)

// 	    	//Handle buttons
// 	    	var raycaster = new THREE.Raycaster();
// 			raycaster.ray.origin.copy( this.controllers.left.position );
// 			raycaster.ray.direction.set( 0, 0, -1 ).applyQuaternion(this.controllers.left.quaternion)

// 		 	//Check buttons and call methods TODO add hover
// 		 	var allBtns = this.apps.reduce((prev, cur)=>{
// 		 		return prev.concat(cur.app.buttons)
// 		 	},[])
// 		 	var inter = allBtns.map((b)=>{
// 				var intersect = raycaster.intersectObject(b.hitbox)
// 				return {intersect: intersect[0], button: b}
// 			}).filter((o)=>{return o.intersect}).sort((a, b)=>{return a.intersect.distance - b.intersect.distance})
// 		 	if(inter.length > 0){
// 				var btn = inter[0].button
// 				if(this.controllers.left.buttons[1].justPressed){
// 			 		btn.pressed = true
// 			 		btn.onPress({point: inter[0].intersect.point})
// 			 	}
// 			}
// 			if(this.controllers.left.buttons[1].justReleased){
// 				allBtns.forEach((b)=>{
// 					if(b.pressed){
// 						b.pressed = false
// 						b.onRelease()
// 					}
// 				})
// 			}

// 			//get change in position to drag objects
// 			var diff = this.controllers.left.position.clone().sub(this.lastLeftPos.pos).multiplyScalar(5)
// 			var diffRot = this.controllers.left.quaternion.clone().multiply(this.lastLeftPos.rot.clone().inverse())

// 	    	//Run all apps
// 			this.apps = this.apps.filter((a)=>{
// 				if(a.appMover.pressed){
// 					//drag around app
// 					a.localStage.position.add(diff)

// 					a.localStage.quaternion.copy(diffRot.clone().multiply(a.localStage.quaternion))

// 					//close app
// 					if(this.controllers.left.buttons[2].justPressed){
// 						a.onClose()
// 						this.globalStage.scene.remove(a.localStage)
// 						return false
// 					}
// 				}

// 				//run app frame event
// 				a.onFrame(delta, time)
// 				return true
// 			})
// 			//get change in position to drag objects
// 			this.lastLeftPos.pos.copy(this.controllers.left.position)
// 			this.lastLeftPos.rot.copy(this.controllers.left.quaternion)
// 		})
// 	}

// 	launchApp = async (url)=>{
// 		$("body").append('<script type="text/javascript" src="'+url+'"></script>')
// 		// var resp = await $.get({url:url, dataType: "text",mimeType: 'text/plain; charset=x-user-defined'})
// 		// eval(resp)
// 	}

// 	createApp():App{
// 		//create app and container
// 		var localStage = new THREE.Object3D
// 		this.globalStage.scene.add(localStage)
// 		var app = new App(localStage, this.globalStage, this.controllers)
// 		var appContainer = new AppContainer(app, localStage)

// 		//create mover button
// 		var moverGeo = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// 		var moverMesh = new THREE.Mesh(moverGeo)
// 		if(this.apps.length == 0){
// 			//adjust launcher app
// 			moverMesh.position.y = -0.05
// 			appContainer.localStage.position.z = 0.2
// 		}
// 		appContainer.localStage.add(moverMesh)
// 		appContainer.appMover = app.input.UI.createButton(moverMesh)
// 		appContainer.appMover.onPress = ()=>{
// 			console.log("press")
// 		}
// 		appContainer.appMover.onRelease = ()=>{
// 			console.log("release")
// 		}

// 		this.apps.push(appContainer)		
// 		return app
// 	}
// }

// export default NiftyOS