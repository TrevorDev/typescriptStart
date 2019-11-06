import { Ray } from "../../math/ray";
import { AppContainer } from "../app/appContainer";
import { Stage } from "../../extensions/stage";
import { Vector3 } from "../../math/vector3";
import { Quaternion } from "../../math/quaternion";
import { TransformObject } from "../../componentObject/baseObjects/transformObject";
import { MeshObject } from "../../componentObject/baseObjects/meshObject";
import { DefaultMesh } from "../../extensions/defaultMesh";
import { DefaultVertexData } from "../../extensions/defaultVertexData";
import { Color } from "../../math/color";
import { App } from "../app/app";

export class XRButtonState {
    private _value = 0
    private _downThreshold = 0.8
    public justDown = false;
    public justUp = false;
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
            this.justUp = true
        } else {
            this._value = val
        }
        //this.onChange.notifyObservers(this)
    }
    update() {
        this.justDown = false
        this.justUp = false
    }
    // onDown = new Observable<XRButtonState>()
    // onUp = new Observable<XRButtonState>()
    // onChange = new Observable<XRButtonState>()
}

export class XRController extends TransformObject {
    ray = new Ray()
    // TODO move this class to os?
    hoveredApp: null | AppContainer = null
    hoveredTaskbar = false
    hitMesh: MeshObject
    mesh: MeshObject

    connected = false;

    primaryButton = new XRButtonState()

    backButton = new XRButtonState()

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
        stage.xrStage.transform.addChild(this.transform)
        this.mesh = DefaultMesh.createMesh(stage.device, { color: Color.createFromHex("#2c3e50") })
        this.mesh.mesh.visible = false
        this.mesh.transform.scale.scaleInPlace(0.05)
        this.mesh.transform.scale.z *= 10
        this.transform.addChild(this.mesh.transform)

        this.hitMesh = DefaultMesh.createMesh(stage.device, { vertexData: DefaultVertexData.createSphereVertexData(stage.device), color: new Color(0.9, 0.9, 0.9) })
        this.hitMesh.transform.scale.scaleInPlace(0.02)
        stage.addNode(this.hitMesh)

        // this.rayMesh = DefaultMesh.createSphere(stage.device)
        // this.rayMesh.scale.scaleInPlace(0.1)
        // this.rayMesh.scale.z *= 5
        // stage.addNode(this.rayMesh)
    }

    isHoveringApp(app: App) {
        return this.hoveredApp && this.hoveredApp.app == app
    }

    getGamepad(): null | Gamepad {
        return null
    }

    update() {
        this.primaryButton.update()
        this.backButton.update()

        var gamepad = this.getGamepad()
        if (gamepad) {
            this.connected = true
            this.mesh.mesh.visible = true

            this.primaryButton.setValue(gamepad.buttons[1].value)
            this.backButton.setValue(gamepad.buttons[4].value)
            if (gamepad.pose) {
                if (gamepad.pose.position) {
                    this.transform.position.set(gamepad.pose.position[0], gamepad.pose.position[1], gamepad.pose.position[2])
                }
                if (gamepad.pose.orientation) {
                    this.transform.rotation.set(gamepad.pose.orientation[0], gamepad.pose.orientation[1], gamepad.pose.orientation[2], gamepad.pose.orientation[3])
                }
            }
        } else {
            this.connected = false
            this.mesh.mesh.visible = false
            this.hitMesh.mesh.visible = false
        }
        this.transform.computeWorldMatrix(true)
        var vec = new Vector3(0, 0, -1)
        var q = new Quaternion()
        this.transform.worldMatrix.decompose(this.ray.origin, q);
        vec.rotateByQuaternionToRef(q, this.ray.direction)
    }


}