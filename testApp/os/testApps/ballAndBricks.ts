import { OS } from "../os"
import { App } from "../app/app"
import { CannonPhysicsWorld } from "../../extensions/physics/cannonPhyscisWorld"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { CannonRigidBodyComponent } from "../../extensions/physics/cannonRigidBodyComponent"
import * as CANNON from "cannon"

var os = OS.GetOS()
os.registerApp({
    appName: "Bricks",
    iconImage: "/public/img/game.png",
    create: (app: App) => {
        var world = new CannonPhysicsWorld()
        // world.world.defaultContactMaterial.

        const wallMaterial = new CANNON.Material("wallM")
        wallMaterial.restitution = 0.0
        wallMaterial.friction = 0.8

        world.world.defaultContactMaterial.contactEquationStiffness = 5e6;
        world.world.defaultContactMaterial.contactEquationRelaxation = 3;

        console.log(world.world.solver)

        // var sphere = new MeshObject(os.device, undefined, DefaultVertexData.createSphereVertexData(os.device))
        // sphere.transform.scale.scaleInPlace(0.1)
        // sphere.transform.position.set(0, 5, 0)
        // app.scene.transform.addChild(sphere.transform)
        // sphere.addComponent(new CannonRigidBodyComponent(world, {
        //     mass: 5, // kg
        //     shape: new CANNON.Sphere(sphere.transform.scale.y / 2),
        //     material: wallMaterial
        // }))

        var scale = 1;
        app.scene.transform.scale.scaleInPlace(1 / scale)

        // var base = 3;
        // for (var level = 0; level < base; level++) {
        //     for (var row = 0; row < level; row++) {
        //         var block = new MeshObject(os.device)
        //         block.transform.scale.scaleInPlace(scale * 0.1)
        //         block.transform.position.set(row * (block.transform.scale.x), level * 2 * (block.transform.scale.y), 0)
        //         app.scene.transform.addChild(block.transform)
        //         block.addComponent(new CannonRigidBodyComponent(world, {
        //             mass: 0.1, // kg
        //             shape: new CANNON.Box(new CANNON.Vec3(block.transform.scale.x / 2, block.transform.scale.y / 2, block.transform.scale.z / 2)),
        //             // material: wallMaterial
        //         }))
        //     }
        // }

        for (var i = 0; i < 3; i++) {
            var block = new MeshObject(os.device)
            block.transform.scale.scaleInPlace(scale * 0.1)
            block.transform.position.set(0, i * scale / 3 + 0.2 * scale, 0)
            app.scene.transform.addChild(block.transform)
            block.addComponent(new CannonRigidBodyComponent(world, {
                mass: 0.1, // kg
                shape: new CANNON.Box(new CANNON.Vec3(block.transform.scale.x / 2, block.transform.scale.y / 2, block.transform.scale.z / 2)),
                // material: wallMaterial
            }))
        }



        var floor = new MeshObject(os.device)
        floor.transform.scale.set(scale * 1, scale * 0.1, scale * 1)
        app.scene.transform.addChild(floor.transform)
        floor.addComponent(new CannonRigidBodyComponent(world, {
            mass: 0, // kg
            shape: new CANNON.Box(new CANNON.Vec3(floor.transform.scale.x / 2, floor.transform.scale.y / 2, floor.transform.scale.z / 2)),
            //material: wallMaterial
        }))


        app.update = (delta) => {
            world.update(delta)
        }

        app.dispose = () => {

        }
    }
})