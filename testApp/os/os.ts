import { Stage } from "../defaultHelpers/stage";
import { InputManager } from "./input/inputManager";
import { AppManager } from "./app/appManager";
import { HitResult, Hit } from "../defaultHelpers/hit";
import { DefaultMesh } from "../defaultHelpers/defaultMesh";
import { GPUDevice } from "../gpu/gpuDevice";

export class OS {
    /**
     * Allow later loaded scripts to access the os
     */
    static GetOS() {
        var global = window as any;
        return global._niftyOS as OS;
    }

    /**
     * Main OS components
     */
    public device: GPUDevice
    private globalStage: Stage
    private inputManager: InputManager;
    private appManager: AppManager

    /**
     * Creates a multitasking OS
     */
    constructor() {
        /**
         * Initialize the os
         */
        this.globalStage = new Stage()
        this.device = this.globalStage.device
        this.inputManager = new InputManager(this.globalStage)
        this.appManager = new AppManager(this.globalStage, this.inputManager)

        // Main render loop
        this.globalStage.renderLoop = ((delta, curTime) => {
            this.inputManager.update(delta, curTime)

            // Cast controller ray into each app
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

            // Run each app's render loop
            this.appManager.update(delta, curTime)
        })

        // OS is done loading
        this.setGlobal()
        console.log("NiftyOS v1.0")

        // Load test app
        require("./testApps/clock")
    }

    /**
     * Make os accessable
     */
    private setGlobal() {
        var global = window as any;
        global._niftyOS = this
    }

    /**
     * Initialize and position app
     */
    createApp() {
        var container = this.appManager.createApp()
        container.containerSpace.position.z = -10
        return container.app
    }

    getInputManager() {
        return this.inputManager
    }
}