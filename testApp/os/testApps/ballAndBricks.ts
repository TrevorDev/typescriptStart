import { OS } from "../os"
import { App } from "../app/app"
import { OimoPhysicsWorld } from "../../extensions/physics/oimoPhysicsWorld"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { OimoRigidBodyComponent } from "../../extensions/physics/oimoRigidBodyComponent"
// @ts-ignore
import * as oimo from "oimo"
import { Matrix4 } from "../../math/matrix4"

console.log(oimo)
var os = OS.GetOS()
os.registerApp({
    appName: "Bricks",
    iconImage: "/public/img/game.png",
    create: (app: App) => {
        var world = new OimoPhysicsWorld();

        var scale = 1;
        app.scene.transform.scale.scaleInPlace(1 / scale)

        for (var i = 0; i < 3; i++) {
            var block = new MeshObject(os.device)
            block.transform.scale.scaleInPlace(scale * 0.1)
            block.transform.position.set(0, i * scale / 3 + 0.1 * scale, 0)
            app.scene.transform.addChild(block.transform)
            block.addComponent(new OimoRigidBodyComponent(world, { type: 'box', pos: [block.transform.position.x, block.transform.position.y, block.transform.position.z], size: [block.transform.scale.x, block.transform.scale.y, block.transform.scale.z], friction: 0.4, restitution: 0.1, move: true, sleep: 0 }))
        }

        var floor = new MeshObject(os.device)
        floor.transform.scale.set(scale * 1, scale * 0.1, scale * 1)
        app.scene.transform.addChild(floor.transform)
        floor.addComponent(new OimoRigidBodyComponent(world, { type: 'box', size: [floor.transform.scale.x, floor.transform.scale.y, floor.transform.scale.z], friction: 0.4, restitution: 0.1, move: false, density: 1 }))


        app.update = (delta) => {
            world.update(delta)
            os.inputManager.controllers.forEach((c) => {
                if (c.primaryButton.justDown) {
                    var block = new MeshObject(os.device)
                    block.transform.scale.scaleInPlace(scale * 0.1)
                    var mat = new Matrix4()
                    app.scene.transform.worldMatrix.inverseToRef(mat)
                    c.ray.origin.rotateByMatrixToRef(mat, block.transform.position)
                    //block.transform.position.set(0, 2, 0)
                    app.scene.transform.addChild(block.transform)
                    block.addComponent(new OimoRigidBodyComponent(world, { type: 'box', pos: [block.transform.position.x, block.transform.position.y, block.transform.position.z], size: [block.transform.scale.x, block.transform.scale.y, block.transform.scale.z], friction: 0.4, restitution: 0.1, move: true, sleep: 0 }))
                    mat.setPosition(0, 0, 0)
                    c.ray.direction.rotateByMatrixToRef(mat, block.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!.body.linearVelocity)
                    console.log(c.ray.direction)
                    console.log(block.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!.body.linearVelocity)
                    block.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!.body.linearVelocity.x *= 5
                    block.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!.body.linearVelocity.y *= 5
                    block.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!.body.linearVelocity.z *= 5
                }
            })
        }

        app.dispose = () => {

        }
    }
})