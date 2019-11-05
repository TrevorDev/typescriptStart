// @ts-ignore
import * as OIMO from "oimo"
import { OimoRigidBodyComponent } from "./oimoRigidBodyComponent";

export class OimoPhysicsWorld {
    world: OIMO.World
    components: Array<OimoRigidBodyComponent> = []

    constructor() {

        this.world = new OIMO.World({
            timestep: 1 / 60,
            iterations: 50,
            // broadphase: 3, // 1: brute force, 2: sweep & prune, 3: volume tree
            worldscale: 1,
            random: false,
            info: true, // display statistique
        });

    }

    addComponent(c: OimoRigidBodyComponent) {
        //this.world.add(c.body);
        this.components.push(c)
    }

    update(deltaTime: number) {
        this.world.step();
        this.components.forEach((c) => {
            c.updateToObject()
        })
    }
}