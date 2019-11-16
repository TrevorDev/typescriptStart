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

export class Launcher {
    constructor(os: OS, appManager: AppManager) {
        os.registerApp({
            appName: "Launcher",
            iconImage: null,
            create: (app: App) => {
                var firstApp = true;


                var hitable = new Array<MeshObject>()
                var saveButton = new Button(os.device, "Save")
                saveButton.pointerEvent.onClick = () => { console.log("save") }
                saveButton
                app.scene.transform.addChild(saveButton.mesh.transform)
                saveButton.mesh.transform.position.y += 0.13

                var clearButton = new Button(os.device, "Clear")
                clearButton.pointerEvent.onClick = () => { console.log("clear") }
                app.scene.transform.addChild(clearButton.mesh.transform)

                hitable.push(saveButton.mesh)
                hitable.push(clearButton.mesh)




                var appIcons = new Array<MeshObject>()

                var castResults: { [key: string]: HitResult } = {}
                app.castRay = (controller, result) => {
                    if (!castResults[controller.hand]) {
                        castResults[controller.hand] = new HitResult()
                    }
                    Hit.rayIntersectsMeshes(controller.ray, hitable, castResults[controller.hand])
                    result.copyFrom(castResults[controller.hand])
                }


                app.update = (delta, cur, controllers) => {

                    hitable.forEach((o) => {
                        var p = o.getComponent<PointerEventComponent>(PointerEventComponent.type)
                        if (p) {
                            var hit = false;
                            for (var c of controllers) {
                                if (castResults[c.hand]) {
                                    var obj = castResults[c.hand].hitObject
                                    if (obj == o && c.isHoveringApp(app)) {
                                        hit = true
                                        break;
                                    }
                                }
                            }
                            p.setHovered(hit)
                        }
                    })
                    controllers.forEach((c) => {
                        if (castResults[c.hand]) {
                            var obj = castResults[c.hand].hitObject
                            if (c.primaryButton.justDown && obj) {
                                var p = obj.getComponent<PointerEventComponent>(PointerEventComponent.type)
                                if (p && !c.hoveredTaskbar && c.isHoveringApp(app)) {
                                    p.click()
                                }
                            }
                        }

                    })

                    // controllers.forEach((c) => {
                    //     if (c.primaryButton.justDown) {
                    //         console.log("Trying to hit sphere")
                    //         hitRes.reset()
                    //         Hit.rayIntersectsMeshes(c.ray, appIcons, hitRes)
                    //         if (hitRes.hitObject) {
                    //             console.log("HIT SPHERE")
                    //             var pe = hitRes.hitObject.getComponent<PointerEventComponent>(PointerEventComponent.type)
                    //             if (pe && !c.hoveredTaskbar && c.isHoveringApp(app)) {
                    //                 pe.click()
                    //             }
                    //         }
                    //     }
                    // })
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
                    hitable.push(appIcon)

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