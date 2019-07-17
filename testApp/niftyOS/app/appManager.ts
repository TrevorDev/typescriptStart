import { AppContainer } from "./appContainer";
import { Nullable } from "../types/common";
import THREE = require("three");
import { InputManager } from "../input/inputManager";
import { Stage } from "../stage/stage";
import { App } from "./app";

export class AppManager{
    activeApp:Nullable<AppContainer> = null;
    appContainers = new Array<AppContainer>()
    constructor(private globalStage:Stage, private inputManager:InputManager){

    }
    update(delta:number, curTime:number){

    }

    createApp(){
        var appContainer = new AppContainer(this.globalStage, this.inputManager);
        this.appContainers.push(appContainer)
        //create app and container
        // var localStage = new THREE.Group()
        // this.globalStage.scene.add(localStage)
        // var app = new App(localStage, this.globalStage, this.inputManager)
        // var appContainer = new AppContainer(app, localStage)

        // //create mover button
        // var moverGeo = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        // var moverMesh = new THREE.Mesh(moverGeo)
        // if(this.apps.length == 0){
        // //adjust launcher app
        // moverMesh.position.y = -0.05
        // appContainer.localStage.position.z = 0.2
        // }
        // appContainer.localStage.add(moverMesh)
        // appContainer.appMover = app.input.UI.createButton(moverMesh)
        // appContainer.appMover.onPress = ()=>{
        // console.log("press")
        // }
        // appContainer.appMover.onRelease = ()=>{
        // console.log("release")
        // }

        // this.apps.push(appContainer)		
        return appContainer
    }

}