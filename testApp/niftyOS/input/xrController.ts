import * as THREE from "three"
import { Stage } from "../stage/stage";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import { Observable } from "../events/observable";
import { MathHelper } from "../math/mathHelper";
import { Nullable } from "../types/common";
import { AppContainer } from "../app/appContainer";
import { App } from "../app/app";

export class XRButtonState {
    private _value = 0
    private _downThreshold = 0.8
    constructor(){
    }
    get value(){
        return this._value
    }
    isDown(){
        if(this.value > this._downThreshold){
            return true
        }else{
            return false
        }
    }
    setValue(val:number){
        //console.log(val+" "+this._value)
        if(val >= this._downThreshold && this._value < this._downThreshold){
            this._value = val
            this.onDown.notifyObservers(this)
        }else if(val < this._downThreshold && this._value >= this._downThreshold){
            this._value = val
            this.onUp.notifyObservers(this)
        }else{
            this._value = val
        }
        this.onChange.notifyObservers(this)
    }
    onDown = new Observable<XRButtonState>()
    onUp = new Observable<XRButtonState>()
    onChange = new Observable<XRButtonState>()
}
export class XRController {
    static ID_COUNTER = 0;
    
    grip: THREE.Group
    pointer: THREE.Group

    raycaster = new THREE.Raycaster();
    
    id:number

    primaryButton = new XRButtonState()

    onMove = new Observable<XRController>()

    hoveredApp:Nullable<App> = null
    hoveredIntersection:Nullable<THREE.Intersection> = null
    
    constructor(private stage:Stage, private poseObject:THREE.Object3D, private isMouse=false){
        this.id = XRController.ID_COUNTER++

        this.grip = new THREE.Group()
        this.pointer = new THREE.Group()

        stage.scene.add(this.grip)
        stage.scene.add(this.pointer)

        if(!this.isMouse){
            var ray = SceneObjectCreator.createRay(stage.scene)
            ray.scale.setScalar(0.1)
            ray.scale.z = 100
            ray.scale.x = 0.001
            ray.scale.y = 0.001
        
            this.pointer.add(ray)
        }
        

        // var box = SceneObjectCreator.createBox(stage.scene)
        // box.scale.set(0.1,0.1,0.1)
        // this.grip.add(box)
        //this.grip.matrixAutoUpdate = false

        if(isMouse){
            var tmpMat = new THREE.Matrix4()
            var tmpVec = new THREE.Vector3()
            var mouse = new THREE.Vector2();
            document.addEventListener("pointermove", (e)=>{
                mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
                mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
                this.raycaster.setFromCamera( mouse, stage.camera );
                tmpVec.copy(this.raycaster.ray.origin)
                tmpVec.add(this.raycaster.ray.direction)
                tmpMat.lookAt(this.raycaster.ray.origin, tmpVec, this.stage.camera.up)
                tmpMat.setPosition(this.raycaster.ray.origin)
                MathHelper.decomposeMatrixToObject(tmpMat, this.pointer)
                MathHelper.decomposeMatrixToObject(tmpMat, this.grip)
            })
            document.addEventListener("pointerdown", (e)=>{
                this.primaryButton.setValue(1);
            })
            document.addEventListener("pointerup", (e)=>{
                this.primaryButton.setValue(0);
            })
        }else{
            var threeController = (poseObject as any)
            threeController.addEventListener( 'selectstart', ()=>{
                this.primaryButton.setValue(1);

            } );
            threeController.addEventListener( 'selectend', ()=>{
                this.primaryButton.setValue(0);
            } );
        }
    }

    private tmpMatrix = new THREE.Matrix4()
    update(){
        if(this.isMouse){
            return
        }
        MathHelper.decomposeMatrixToObject(this.poseObject.matrix, this.grip)
        this.tmpMatrix.copy(this.poseObject.matrix)
        MathHelper.rotateMatrixByEuler(-0.5,0,0, this.tmpMatrix)
        MathHelper.decomposeMatrixToObject(this.tmpMatrix, this.pointer)
        MathHelper.setRayFromObject(this.pointer, this.raycaster.ray)
    }

}