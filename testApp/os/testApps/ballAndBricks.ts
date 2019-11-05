import { OS } from "../os"
import { App } from "../app/app"
import { OimoPhysicsWorld } from "../../extensions/physics/oimoPhysicsWorld"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { OimoRigidBodyComponent } from "../../extensions/physics/oimoRigidBodyComponent"
import { Matrix4 } from "../../math/matrix4"
// @ts-ignore
import * as oimo from "oimo"

var os = OS.GetOS()
os.registerApp({
    appName: "Bricks",
    iconImage: "/public/img/game.png",
    create: (app: App) => {
        var blocks: Array<MeshObject> = []
        var blockInd = 0;

        var createBlock = () => {
            if (blocks.length >= 10) {
                var block = blocks[blockInd]
                blockInd++
                blockInd = blockInd % blocks.length
                return block
            }
            var block = new MeshObject(os.device)
            block.transform.scale.scaleInPlace(0.1)
            app.scene.transform.addChild(block.transform)
            block.addComponent(new OimoRigidBodyComponent(world, { type: 'box', size: [block.transform.scale.x, block.transform.scale.y, block.transform.scale.z], friction: 0.4, restitution: 0.1, move: true, sleep: 0 }))
            blocks.push(block)
            return block
        }
        var tmpMatrix = new Matrix4()
        var world = new OimoPhysicsWorld();

        var base = 3
        for (var level = base; level >= 0; level--) {
            for (var row = 0; row < level; row++) {
                var block = createBlock()

                var xGap = block.transform.scale.x + 0.02
                var xPos = (row * xGap) // distance along row
                xPos -= ((base - 1) / 2 * xGap) // adjust to center tower at the middle
                xPos += ((base - level) * xGap / 2) // adjust to make each level inbetween the lower bricks

                var yGap = block.transform.scale.y + 0.02
                var yPos = (base - level) * yGap // position higher for each level
                yPos += yGap // adjust as floor is thick

                block.transform.position.set(xPos, yPos, 0)
                block.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!.updateFromObject()
            }
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
                if (c.primaryButton.justDown) {
                    var block = createBlock()
                    var physComp = block.getComponent<OimoRigidBodyComponent>(OimoRigidBodyComponent.type)!
                    app.scene.transform.worldMatrix.inverseToRef(tmpMatrix)
                    c.ray.origin.rotateByMatrixToRef(tmpMatrix, block.transform.position)
                    physComp.updateFromObject()

                    tmpMatrix.setPosition(0, 0, 0)
                    c.ray.direction.rotateByMatrixToRef(tmpMatrix, physComp.body.linearVelocity)
                    physComp.body.linearVelocity.x *= 5
                    physComp.body.linearVelocity.y *= 5
                    physComp.body.linearVelocity.z *= 5
                }
            })
        }

        app.dispose = () => {

        }
    }
})