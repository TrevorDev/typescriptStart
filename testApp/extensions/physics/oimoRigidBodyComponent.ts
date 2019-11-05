import { Component } from "../../componentObject/components/component";
import { OimoPhysicsWorld } from "./oimoPhysicsWorld";
// @ts-ignore
import * as OIMO from "oimo"

export class OimoRigidBodyComponent extends Component {
    static type = Component._TYPE_COUNTER++;
    body: OIMO.Body
    getType(): number {
        return OimoRigidBodyComponent.type
    }
    constructor(world: OimoPhysicsWorld, options: OIMO.IBodyOptions) {
        super()
        this.body = world.world.add(options);
        world.addComponent(this)
    }

    onObjectSet() {
        this.updateFromObject()
    }

    updateFromObject() {
        //console.log(this.body)
        this.body.position.x = this.object.transform.position.x
        this.body.position.y = this.object.transform.position.y
        this.body.position.z = this.object.transform.position.z

        this.body.orientation.x = this.object.transform.rotation.x
        this.body.orientation.y = this.object.transform.rotation.y
        this.body.orientation.z = this.object.transform.rotation.z
        this.body.orientation.w = this.object.transform.rotation.w
        this.body.syncShapes();
    }

    updateToObject() {
        this.object.transform.position.x = this.body.position.x
        this.object.transform.position.y = this.body.position.y
        this.object.transform.position.z = this.body.position.z

        this.object.transform.rotation.x = this.body.orientation.x
        this.object.transform.rotation.y = this.body.orientation.y
        this.object.transform.rotation.z = this.body.orientation.z
        this.object.transform.rotation.w = this.body.orientation.w
    }
}