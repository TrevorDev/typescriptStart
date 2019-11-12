import { Stage } from "../extensions/stage";
import { InputManager } from "./input/inputManager";
import { AppManager } from "./app/appManager";
import { HitResult, Hit } from "../extensions/hit";
import { GPUDevice } from "../gpu/gpuDevice";
import { AppContainer } from "./app/appContainer";
import { Launcher } from "./homeEnv/launcher";
import { AppSpec } from "./app/appSpec";
import { DefaultMesh } from "../extensions/defaultMesh";
import { Color } from "../math/color";
import { DragComponent } from "../componentObject/components/behavior/dragComponent";
import { DefaultVertexData } from "../extensions/defaultVertexData";
import { BasicMaterial } from "../componentObject/components/material/basicMaterial";
import { InstanceGroup } from "../extensions/instanceGroup";
import { MeshObject } from "../componentObject/baseObjects/meshObject";
import { CannonPhysicsWorld } from "../extensions/physics/cannonPhyscisWorld";
import { CannonRigidBodyComponent } from "../extensions/physics/cannonRigidBodyComponent";
import * as CANNON from "cannon"
import { Vector3 } from "../math/vector3";

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
    public globalStage: Stage
    public inputManager: InputManager;
    public appManager: AppManager
    public launcherApp: null | AppContainer = null

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

        // INSTANCE TEST (Currently seems like theres in a bug in occulus browser as it works in chrome/firefox)
        // // var pObj = new MeshObject(this.device)
        // // pObj.transform.position.set(0, 2, -10)
        // // this.globalStage.addNode(pObj)

        // var ig = new InstanceGroup(this.device, 100)
        // for (var i = 0; i < ig.numInstances; i++) {
        //     var obj = new MeshObject(this.device, ig.material, ig.vertexData)
        //     obj.mesh.vertData = ig.vertexData
        //     obj.transform.worldMatrix.m = new Float32Array(ig.instanceWorlds.buffer, i * 16 * 4, 16);
        //     obj.transform.scale.scaleInPlace(0.1)
        //     obj.transform.position.z = -10
        //     obj.transform.position.x = Math.random() * 10 - 5
        //     obj.transform.position.y = Math.random() * 10 - 5
        //     obj.mesh.isInstance = true
        //     obj.mesh.visible = false

        //     //pObj.transform.addChild(obj.transform)
        //     this.globalStage.addNode(obj)
        // }

        // this.globalStage.instanceGroups.push(ig)


        // Render environment
        var floor = DefaultMesh.createMesh(this.device, { color: Color.createFromHex("#34495e") })
        floor.transform.scale.set(100, 0.1, 100)
        floor.transform.position.y -= floor.transform.scale.y / 2
        this.globalStage.addNode(floor)

        var lightSphere = DefaultMesh.createMesh(this.device, { vertexData: DefaultVertexData.createSphereVertexData(this.device), color: Color.createFromHex("#ecf0f1") });
        (lightSphere.material.material as BasicMaterial).ambientColor.set(1, 1, 1, 1)
        lightSphere.transform.scale.scaleInPlace(4)
        lightSphere.transform.position.copyFrom(this.globalStage.lights[0].transform.position)
        this.globalStage.addNode(lightSphere)

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
             * When hovering the taskbar of an app the app will be considered hovered
             * however when casting rays inside an apps update function the hoveredTaskbar 
             * value can  tell the app if the taskbar is hit before actual app contents
             * 
             */
            this.inputManager.controllers.forEach((controller) => {
                if (!controller.connected) {
                    return
                }
                var closestHit = { distance: Infinity, obj: null }
                var hitResult = new HitResult()

                controller.hoveredTaskbar = false
                // Check which app is hovered for this controller
                this.appManager.appContainers.forEach((container) => {
                    Hit.rayIntersectsMesh(controller.ray, container.taskBar, hitResult)

                    if (hitResult.hitDistance && hitResult.hitDistance < closestHit.distance) {
                        closestHit.distance = hitResult.hitDistance
                        controller.hoveredTaskbar = true
                        controller.hoveredApp = container
                    }
                    container.app.castRay(controller.ray, hitResult)
                    if (hitResult.hitDistance && hitResult.hitDistance < closestHit.distance) {
                        closestHit.distance = hitResult.hitDistance
                        controller.hoveredTaskbar = false
                        controller.hoveredApp = container
                    }
                })

                // Position gaze mesh
                if (closestHit.distance < Infinity) {
                    controller.hitMesh.transform.position.copyFrom(controller.ray.direction)
                    controller.hitMesh.transform.position.scaleInPlace(closestHit.distance)
                    controller.hitMesh.transform.position.addToRef(controller.ray.origin, controller.hitMesh.transform.position)
                    controller.hitMesh.mesh.visible = true
                } else {
                    controller.hitMesh.mesh.visible = false
                }

                var shouldDelete: null | AppContainer = null
                this.appManager.appContainers.forEach((container) => {
                    var drag = container.taskBar.getComponent<DragComponent>(DragComponent.type)!
                    if (controller.hoveredApp == container) {
                        if (controller.primaryButton.justDown && controller.hoveredTaskbar) {
                            this.appManager.activeApp = container
                            drag.start(controller)
                        }
                    }
                    drag.update()
                    if (drag.isDragging() && (controller.primaryButton.justUp || controller.backButton.justDown)) {
                        drag.end()

                        if (controller.backButton.justDown) {
                            shouldDelete = container
                        }
                    }
                })
                if (shouldDelete) {
                    this.appManager.disposeApp(shouldDelete)
                }
            })

            // Run each app's render loop
            this.appManager.update(delta, curTime, this.inputManager.controllers)
        })

        // OS is done loading
        this.setGlobal()
        console.log("NiftyOS v1.0")

        // Create launcher
        var launcher = new Launcher(this, this.appManager)

        // Register a test app
        require("./testApps/voxelEditor")
        //require("./testApps/flight")
        // require("./testApps/desktop")
        // require("./testApps/clock")
        // require("./testApps/blocks")
        // require("./testApps/video")
        // require("./testApps/ballAndBricks")

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
    registerApp(appSpec: AppSpec) {
        if (!this.launcherApp) {
            var container = this.appManager.createApp()
            this.launcherApp = container
            appSpec.create(container.app)
        } else {
            (this.launcherApp.app as any).registerApp(appSpec)
        }
    }

    getInputManager() {
        return this.inputManager
    }
}