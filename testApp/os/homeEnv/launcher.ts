import { OS } from "../os";
import { App } from "../app/app";
import { AppSpec } from "../app/appSpec";
import { Hit, HitResult } from "../../extensions/hit";
import { MeshObject } from "../../componentObject/baseObjects/meshObject";
import { PointerEventComponent } from "../../componentObject/components/behavior/pointerEventComponent";
import { AppManager } from "../app/appManager";
import { DefaultMesh } from "../../extensions/defaultMesh";
import { Texture } from "../../gpu/texture";
import { Button } from "../../extensions/ui/button";
import { ControllerRaySystem } from "../../componentObject/systems/controllerRaySystem";

export class Launcher {
    constructor(os: OS, appManager: AppManager) {
        os.registerApp({
            appName: "Launcher",
            iconImage: null,
            create: (app: App) => {
                var firstApp = true;

                var controllerRaySystem = new ControllerRaySystem(app)

                var saveButton = new Button(os.device, "Save")
                saveButton.pointerEvent.onClick = () => { console.log("save") }
                app.scene.transform.addChild(saveButton.mesh.transform)
                saveButton.mesh.transform.position.y += 0.13

                var clearButton = new Button(os.device, "Clear")
                clearButton.pointerEvent.onClick = () => { console.log("clear") }
                app.scene.transform.addChild(clearButton.mesh.transform)

                controllerRaySystem.hitable.push(saveButton.mesh)
                controllerRaySystem.hitable.push(clearButton.mesh)




                var appIcons = new Array<MeshObject>()

                app.castRay = (controller, result) => {
                    controllerRaySystem.castRay(controller, result)
                }


                app.update = (delta, cur, controllers) => {
                    controllerRaySystem.update(os.inputManager.controllers)
                }

                app.dispose = () => {

                }

                (app as any).registerApp = async (appSpec: AppSpec) => {
                    var texture = undefined
                    if (appSpec.iconImage) {
                        var image = new Image();
                        image.src = appSpec.iconImage;  // MUST BE SAME DOMAIN!!!
                        await new Promise((res) => {
                            image.onload = function () {
                                res()
                            };
                        });
                        texture = Texture.createFromeSource(os.device, image)
                    }
                    var appIcon = DefaultMesh.createMesh(os.device, { texture: texture });
                    appIcon.transform.scale.scaleInPlace(0.3)
                    appIcon.transform.position.y = appIcon.transform.scale.y / 2
                    appIcon.transform.position.z = -2

                    var pointerComponent = new PointerEventComponent()
                    pointerComponent.onClick = () => {
                        var appContainer = appManager.createApp()
                        appSpec.create(appContainer.app)
                        os.appManager.activeApp = appContainer
                    }
                    appIcon.addComponent(pointerComponent)

                    app.scene.transform.addChild(appIcon.transform)
                    appIcons.push(appIcon)
                    controllerRaySystem.hitable.push(appIcon)

                    appIcons.forEach((icon, i) => {
                        var mid = appIcons.length / 2
                        var offset = i + 0.5 - mid
                        icon.transform.position.x = offset * 0.4
                    })

                    if (firstApp) {
                        console.log("launch!")
                        pointerComponent.onClick()
                        firstApp = false;
                    }
                }
            }
        })
    }
}