import * as CANNON from "cannon"
import { Component } from "../../componentObject/components/component";
import { CannonPhysicsWorld } from "./cannonPhyscisWorld";
import { Vector3 } from "../../math/vector3";
import { BaseObject } from "../../componentObject/baseObjects/baseObject";
import { TransformObject } from "../../componentObject/baseObjects/transformObject";

export class CannonRigidBodyComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    body: CANNON.Body
    getType(): number {
        return CannonRigidBodyComponent.type
    }
    constructor(world: CannonPhysicsWorld, options: CANNON.IBodyOptions) {
        super()

        var radius = 1; // m
        this.body = new CANNON.Body(options);
        world.addComponent(this)
    }

    onObjectSet() {
        this.updateFromObject()
    }

    updateFromObject() {
        // this.object.transform.computeWorldMatrix()
        // this.object.transform.worldMatrix.decompose(this.body.position as any, this.body.quaternion as any)

        this.body.position.x = this.object.transform.position.x
        this.body.position.y = this.object.transform.position.y
        this.body.position.z = this.object.transform.position.z

        this.body.quaternion.x = this.object.transform.rotation.x
        this.body.quaternion.y = this.object.transform.rotation.y
        this.body.quaternion.z = this.object.transform.rotation.z
        this.body.quaternion.w = this.object.transform.rotation.w
    }

    updateToObject() {
        // this.object.transform.worldMatrix.compose(this.body.position as any, this.body.quaternion as any, new Vector3(1,1,1))
        // this.object.transform.setLocalMatrixFromWorldMatrix(this.object.transform.worldMatrix)

        this.object.transform.position.x = this.body.position.x
        this.object.transform.position.y = this.body.position.y
        this.object.transform.position.z = this.body.position.z

        this.object.transform.rotation.x = this.body.quaternion.x
        this.object.transform.rotation.y = this.body.quaternion.y
        this.object.transform.rotation.z = this.body.quaternion.z
        this.object.transform.rotation.w = this.body.quaternion.w
    }
}