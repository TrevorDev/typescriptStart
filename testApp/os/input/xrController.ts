import { TransformNode } from "../../sceneGraph/transformNode";
import { Ray } from "../../math/ray";
import { AppContainer } from "../app/appContainer";
import { Stage } from "../../defaultHelpers/stage";
import { DefaultMesh } from "../../defaultHelpers/defaultMesh";
import { Vector3 } from "../../math/vector3";
import { Quaternion } from "../../math/quaternion";
import { Mesh } from "../../sceneGraph/mesh";
import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { MeshObject } from "../../componentObject/baseObjects/meshObject";

export class XRButtonState {
    private _value = 0
    private _downThreshold = 0.8
    public justDown = false;
    constructor() {
    }
    get value() {
        return this._value
    }
    isDown() {
        if (this.value > this._downThreshold) {
            return true
        } else {
            return false
        }
    }
    setValue(val: number) {
        //console.log(val+" "+this._value)
        if (val >= this._downThreshold && this._value < this._downThreshold) {
            this._value = val
            //this.onDown.notifyObservers(this)
            this.justDown = true
        } else if (val < this._downThreshold && this._value >= this._downThreshold) {
            this._value = val
            //this.onUp.notifyObservers(this)
        } else {
            this._value = val
        }
        //this.onChange.notifyObservers(this)
    }
    update() {
        this.justDown = false
    }
    // onDown = new Observable<XRButtonState>()
    // onUp = new Observable<XRButtonState>()
    // onChange = new Observable<XRButtonState>()
}

export class XRController extends TransformObject {
    ray = new Ray()
    // TODO move this class to os?
    hoveredApp: null | AppContainer = null
    hitMesh: MeshObject
    rayMesh: MeshObject

    primaryButton = new XRButtonState()

    constructor(stage: Stage, hand: string) {
        super()
        if (hand == "left") {
            this.getGamepad = () => {
                return stage.xr.leftController
            }
        } else {
            this.getGamepad = () => {
                return stage.xr.rightController
            }
        }
        stage.addNode(this)
        var mesh = new MeshObject(stage.device)//DefaultMesh.createCube(stage.device)
        mesh.transform.scale.scaleInPlace(0.05)
        mesh.transform.scale.z *= 10
        this.transform.addChild(mesh.transform)

        this.hitMesh = new MeshObject(stage.device)//DefaultMesh.createSphere(stage.device)
        this.hitMesh.transform.scale.scaleInPlace(0.1)
        stage.addNode(this.hitMesh)

        // this.rayMesh = DefaultMesh.createSphere(stage.device)
        // this.rayMesh.scale.scaleInPlace(0.1)
        // this.rayMesh.scale.z *= 5
        // stage.addNode(this.rayMesh)
    }

    getGamepad(): null | Gamepad {
        return null
    }

    update() {
        this.primaryButton.update()

        var gamepad = this.getGamepad()
        if (gamepad) {
            this.primaryButton.setValue(gamepad.buttons[1].value)
            if (gamepad.pose) {
                if (gamepad.pose.position) {
                    this.transform.position.set(gamepad.pose.position[0], gamepad.pose.position[1], gamepad.pose.position[2])
                }
                if (gamepad.pose.orientation) {
                    this.transform.rotation.set(gamepad.pose.orientation[0], gamepad.pose.orientation[1], gamepad.pose.orientation[2], gamepad.pose.orientation[3])
                }
            }
        }
        this.transform.computeWorldMatrix(true)
        var vec = new Vector3(0, 0, -1)
        var q = new Quaternion()
        this.transform.worldMatrix.decompose(this.ray.origin, q);
        vec.rotateByQuaternionToRef(q, this.ray.direction)
    }


}