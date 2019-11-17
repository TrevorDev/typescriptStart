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
import { TransformObject } from "../../componentObject/baseObjects/transformObject"
import { BasicMaterial } from "../../componentObject/components/material/basicMaterial"
import { Texture } from "../../gpu/texture"
import { Color } from "../../math/color"

var os = OS.GetOS()
os.registerApp({
    appName: "Flight",
    iconImage: "/public/img/flight.png",
    create: (app: App) => {
        var file = os.filesystem.getVoxelFile()
        console.log(file)

        var tmpMatrix = new Matrix4()
        var tmpMatrixB = new Matrix4()
        var tmpVector = new Vector3()
        var tmpQuaterion = new Quaternion()
        var world = new OimoPhysicsWorld();

        var plane = new TransformObject()
        plane.transform.position.y = 0.2
        app.scene.transform.addChild(plane.transform)


        if (file) {
            file.voxels.forEach((v) => {
                var mat = new BasicMaterial(os.device)
                mat.diffuseTexture = Texture.createFromColor(os.device, v.color)
                var voxel = new MeshObject(os.device, mat)
                voxel.transform.position.copyFrom(v.position)
                voxel.transform.scale.scaleInPlace(file!.size)
                plane.transform.addChild(voxel.transform)
            })
            plane.addComponent(new OimoRigidBodyComponent(world, { type: 'box', size: [0.1, 0.1, 0.3], friction: 0.4, restitution: 0.1, move: true, density: 1 }))
        } else {
            var planeMesh = new MeshObject(os.device)
            planeMesh.transform.scale.set(0.1, 0.1, 0.3)
            plane.transform.addChild(planeMesh.transform)
            plane.addComponent(new OimoRigidBodyComponent(world, { type: 'box', size: [planeMesh.transform.scale.x, planeMesh.transform.scale.y, planeMesh.transform.scale.z], friction: 0.4, restitution: 0.1, move: true, density: 1 }))
        }

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