import * as CANNON from "cannon"
import { CannonRigidBodyComponent } from "./cannonRigidBodyComponent";

export class CannonPhysicsWorld {
    world: CANNON.World
    components: Array<CannonRigidBodyComponent> = []

    constructor() {
        // Setup our world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // m/s²
        this.world.solver.iterations = 100;
        //(this.world.solver as any).tolerance = 0.0001
        this.world.broadphase = new CANNON.NaiveBroadphase()
        // // Create a sphere
        // var radius = 1; // m
        // var sphereBody = new CANNON.Body({
        //     mass: 5, // kg
        //     position: new CANNON.Vec3(0, 0, 10), // m
        //     shape: new CANNON.Sphere(radius)
        // });
        // this.world.addBody(sphereBody);

        // // Create a plane
        // var groundBody = new CANNON.Body({
        //     mass: 0 // mass == 0 makes the body static
        // });
        // var groundShape = new CANNON.Plane();
        // groundBody.addShape(groundShape);
        // this.world.addBody(groundBody);

    }

    addComponent(c: CannonRigidBodyComponent) {
        this.world.addBody(c.body);
        this.components.push(c)
    }

    update(deltaTime: number) {
        var fixedTimeStep = 1.0 / 60.0; // seconds
        var maxSubSteps = 3;
        this.world.step(fixedTimeStep, deltaTime, maxSubSteps);
        this.components.forEach((c) => {
            c.updateToObject()
        })
    }
}