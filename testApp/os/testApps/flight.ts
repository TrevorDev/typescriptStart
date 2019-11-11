import { OS } from "../os"
import { App } from "../app/app"
import { OimoPhysicsWorld } from "../../extensions/physics/oimoPhysicsWorld"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { OimoRigidBodyComponent } from "../../extensions/physics/oimoRigidBodyComponent"
import { Matrix4 } from "../../math/matrix4"
// @ts-ignore
import * as oimo from "oimo"
import { Quaternion } from "../../math/quaternion"
import { Vector3 } from "../../math/vector3"

var os = OS.GetOS()
os.registerApp({
    appName: "Flight",
    iconImage: "/public/img/flight.png",
    create: (app: App) => {


        var tmpMatrix = new Matrix4()
        var tmpMatrixB = new Matrix4()
        var tmpVector = new Vector3()
        var tmpQuaterion = new Quaternion()
        var world = new OimoPhysicsWorld();

        var plane = new MeshObject(os.device)
        plane.transform.position.y = 0.2
        plane.transform.scale.set(0.1, 0.1, 0.3)
        app.scene.transform.addChild(plane.transform)
        plane.addComponent(new OimoRigidBodyComponent(world, { type: 'box', size: [plane.transform.scale.x, plane.transform.scale.y, plane.transform.scale.z], friction: 0.4, restitution: 0.1, move: true, density: 1 }))

        var floor = new MeshObject(os.device)
        floor.transform.scale.set(1, 0.1, 1)
        app.scene.transform.addChild(floor.transform)
        floor.addComponent(new OimoRigidBodyComponent(world, { type: 'box', size: [floor.transform.scale.x, floor.transform.scale.y, floor.transform.scale.z], friction: 0.4, restitution: 0.1, move: false, density: 1 }))


        app.update = (delta) => {
            if (!os.appManager.isActiveForApp(app)) {
                return
            }
            world.update(delta)
            os.inputManager.controllers.forEach((c) => {
                if (c.hoveredTaskbar) {
                    return;
                }
                if (c.hand == "left") {
                    var physComp = plane.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!
                    physComp.body.linearVelocity.y += c.primaryJoystick.y * 30 * delta


                    plane.transform.localMatrix.decompose(undefined, tmpQuaterion)
                    tmpMatrix.compose(undefined, tmpQuaterion)

                    var dir = new Vector3(0, 0, c.primaryJoystick.y)
                    dir.rotateByMatrixToRef(tmpMatrix, dir)

                    physComp.body.linearVelocity.x = dir.x
                    physComp.body.linearVelocity.y = dir.y
                    physComp.body.linearVelocity.z = dir.z

                    physComp.body.angularVelocity.x = 0
                    physComp.body.angularVelocity.y = 0
                    physComp.body.angularVelocity.z = 0
                } else {
                    var physComp = plane.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!
                    plane.transform.computeLocalMatrix()

                    // Compute rotation matrix
                    plane.transform.localMatrix.decompose(undefined, tmpQuaterion)
                    tmpMatrix.compose(undefined, tmpQuaterion)

                    // Create rotation matrix from euler
                    tmpVector.set(0.05 * c.primaryJoystick.y, 0, 0);
                    tmpQuaterion.fromEuler(tmpVector)
                    tmpMatrixB.compose(new Vector3(0, 0, 0), tmpQuaterion);

                    // rotate rotation matrix by euler
                    tmpMatrix.multiplyToRef(tmpMatrixB, tmpMatrix)


                    // Create rotation matrix from euler
                    tmpVector.set(0, 0, -0.05 * c.primaryJoystick.x);
                    tmpQuaterion.fromEuler(tmpVector)
                    tmpMatrixB.compose(new Vector3(0, 0, 0), tmpQuaterion);

                    // rotate rotation matrix by euler
                    tmpMatrix.multiplyToRef(tmpMatrixB, tmpMatrix)

                    // Set back rotation on object
                    tmpMatrix.decompose(undefined, plane.transform.rotation)

                    physComp.updateFromObject()
                }

            })
        }

        app.dispose = () => {

        }
    }
})