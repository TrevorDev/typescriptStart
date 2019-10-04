import { Stage } from "../defaultHelpers/stage";
import { InputManager } from "./input/inputManager";
import { AppManager } from "./app/appManager";
import { HitResult, Hit } from "../defaultHelpers/hit";
import { DefaultMesh } from "../defaultHelpers/defaultMesh";
import { GPUDevice } from "../gpu/gpuDevice";
import { AppContainer } from "./app/appContainer";
import { App } from "./app/app";

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
    private launcherApp: null | AppContainer = null

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
            /**
             * Multiple apps(one per controller) can be "hovered" only one app can be "active"
             * Launcher starts as active
             * 
             * The active controls the look of the controllers when they point at nothing or the active app
             * 
             * Every frame rays from each controller are casted into into each app
             * The app that is hit closest to the controller is "hovered"
             * 
             * When a controller hovers over an app that is not the active app the controller 
             * will switch to default controller look. If the select action is performed by the controller the hovered
             * app will get the event first handle the button event and choose if it should become active, 
             * after that the active app will get the event if hovered app denies activation
             * 
             * Apps should only handle controller button/joystick events when they are active, 
             * and only handle select events when active or hovered
             * 
             */
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

        // Create launcher
        this.registerApp({
            appName: "Launcher",
            iconImage: null,
            create: (app: App) => {
                var screen = DefaultMesh.createCube(this.device)
                screen.position.y = 1
                app.scene.addChild(screen)

                app.update = (delta) => {
                }

                app.dispose = () => {

                }

                (app as any).registerApp = (appSpec: any) => {
                    console.log(appSpec.appName)
                    var container = this.appManager.createApp()
                    this.launcherApp = container
                    container.containerSpace.position.z = -10
                    appSpec.create(container.app)
                }
            }
        })

        // Register a test app
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
    registerApp(appSpec: any) {
        if (!this.launcherApp) {
            var container = this.appManager.createApp()
            this.launcherApp = container
            container.containerSpace.position.z = -10
            appSpec.create(container.app)
        } else {
            (this.launcherApp.app as any).registerApp(appSpec)
        }
    }

    getInputManager() {
        return this.inputManager
    }
}