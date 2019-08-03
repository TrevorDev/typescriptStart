import { Stage } from "../testApp/niftyOS/stage/stage";
import { SceneObjectCreator } from "../testApp/niftyOS/stage/sceneObjectCreator";
import { SliceController } from "./sliceController";
import { Vector2 } from "three";
import { Player } from "./player";

var main = async()=>{
    console.log("hello")

    // Get rid of margin
    document.documentElement.style["overflow"]="hidden"
    document.documentElement.style.overflow ="hidden"
    document.documentElement.style.width ="100%"
    document.documentElement.style.height ="100%"
    document.documentElement.style.margin ="0"
    document.documentElement.style.padding ="0"
    document.body.style.overflow ="hidden"
    document.body.style.width ="100%"
    document.body.style.height ="100%"
    document.body.style.margin ="0"
    document.body.style.padding ="0"

    var div = document.createElement("div")
    div.style.width = "100%"
    div.style.height = "100%"
    document.body.appendChild(div)

    var controller = new SliceController()
    window.addEventListener("keydown", (e)=>{
        if(e.code == "KeyW"){
            controller.buttonUp.setValue(1)
        }else if(e.code == "KeyA"){
            controller.buttonLeft.setValue(1)
        }else if(e.code == "KeyS"){
            controller.buttonDown.setValue(1)
        }else if(e.code == "KeyD"){
            controller.buttonRight.setValue(1)
        }else if(e.code == "KeyJ"){
            controller.buttonA.setValue(1)
        }else if(e.code == "KeyK"){
            controller.buttonB.setValue(1)
        }else if(e.code == "KeyL"){
            controller.buttonC.setValue(1)
        }else if(e.code == "KeySemicolon"){
            controller.buttonD.setValue(1)
        }
    });
    window.addEventListener("keyup", (e)=>{
        if(e.code == "KeyW"){
            controller.buttonUp.setValue(0)
        }else if(e.code == "KeyA"){
            controller.buttonLeft.setValue(0)
        }else if(e.code == "KeyS"){
            controller.buttonDown.setValue(0)
        }else if(e.code == "KeyD"){
            controller.buttonRight.setValue(0)
        }else if(e.code == "KeyJ"){
            controller.buttonA.setValue(0)
        }else if(e.code == "KeyK"){
            controller.buttonB.setValue(0)
        }else if(e.code == "KeyL"){
            controller.buttonC.setValue(0)
        }else if(e.code == "KeySemicolon"){
            controller.buttonD.setValue(0)
        }
    });

    var stage = new Stage(div, false) 
    SceneObjectCreator.createDefaultLights(stage.scene)
    

    var player = new Player(stage.scene)

    stage.startRenderLoop((delta)=>{
        var dir = new Vector2()
        dir.x = controller.buttonRight.value - controller.buttonLeft.value
        dir.y = controller.buttonUp.value - controller.buttonDown.value
        player.vel.x = dir.x*0.01
        player.vel.y = dir.y*0.01
        player.update(delta)
    })
    
}
main()



