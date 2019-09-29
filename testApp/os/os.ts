import { Stage } from "../defaultHelpers/stage";
import { InputManager } from "./input/inputManager";
import { AppManager } from "./app/appManager";
import { HitResult, Hit } from "../defaultHelpers/hit";
import { DefaultMesh } from "../defaultHelpers/defaultMesh";
import { GPUDevice } from "../gpu/gpuDevice";

export class OS {
    static GetOS() {
        var global = window as any;
        return global._niftyOS as OS;
    }
    public device: GPUDevice
    private globalStage: Stage
    private inputManager: InputManager;
    private appManager: AppManager
    constructor() {
        this.globalStage = new Stage()
        this.device = this.globalStage.device
        this.inputManager = new InputManager(this.globalStage)
        this.appManager = new AppManager(this.globalStage, this.inputManager)


        // Main render loop
        this.globalStage.renderLoop =
            ((delta, curTime) => {
                this.inputManager.update(delta, curTime)

                this.inputManager.controllers.forEach((controller) => {
                    var closestHit = { distance: 0, obj: null }
                    var hitResult = new HitResult()
                    var isTaskBar = false
                    this.appManager.appContainers.forEach((container) => {
                        Hit.rayIntersectsMesh(controller.ray, container.taskBar, hitResult)

                        if (hitResult.hitDistance && hitResult.hitDistance < closestHit.distance) {
                            closestHit.distance = hitResult.hitDistance
                            isTaskBar = true
                            controller.hoveredApp = container
                        }
                        container.app.castRay(controller.ray, hitResult)
                        if (hitResult.hitDistance && hitResult.hitDistance < closestHit.distance) {
                            closestHit.distance = hitResult.hitDistance
                            isTaskBar = false
                            controller.hoveredApp = container
                        }
                    })
                    //controller.hoveredIntersection = closestHit.distance < Infinity ? closestHit : null
                })

                this.appManager.update(delta, curTime)
            })

        this.setGlobal()

        // for (var i = 0; i < 2; i++) {
        //     var mesh = DefaultMesh.createCylinder(this.globalStage.device)
        //     this.globalStage.addNode(mesh)
        //     mesh.position.set(0, -1, -5 - (i * 1.5))
        // }

        console.log("NiftyOS v0.0.1")

        //	require("../niftyOS/testApps/showCase")
        // require("../niftyOS/testApps/targetShooting")
        require("./testApps/clock")
        // require("../niftyOS/testApps/videoPlayer")


    }

    private setGlobal() {
        var global = window as any;
        global._niftyOS = this
    }

    appPos = -2

    createApp() {
        var container = this.appManager.createApp()
        // container.containerSpace.position.x = this.appPos
        container.containerSpace.position.z = -10
        this.appPos++
        return container.app
    }
    getInputManager() {
        return this.inputManager
    }
}