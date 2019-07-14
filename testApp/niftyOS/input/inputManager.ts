import { Stage } from "../stage/stage";

import { XRController } from "./xrController";

export class InputManager {
    private _controllers:Array<XRController> = []
    constructor(private stage:Stage){
        this.leftXRController
        this.rightXRController
    }
    
    get leftXRController(){
        if(!this._controllers[0]){
            this._controllers[0] = new XRController(this.stage, (this.stage.renderer.vr as any).getController(0))
        }
        return this._controllers[0];
    }
    get rightXRController(){
        if(!this._controllers[1]){
            this._controllers[1] = new XRController(this.stage, (this.stage.renderer.vr as any).getController(1))
        }
        return this._controllers[1];
    }

    update(){
        this._controllers.forEach((c)=>{
            c.update()
        })
    }
}