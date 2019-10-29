import { OS } from "../os";
import { App } from "../app/app";
import { AppSpec } from "../app/appSpec";
import { Hit, HitResult } from "../../extensions/hit";
import { MeshObject } from "../../componentObject/baseObjects/meshObject";
import { PointerEventComponent } from "../../componentObject/components/behavior/pointerEventComponent";
import { AppManager } from "../app/appManager";
import { DefaultMesh } from "../../extensions/defaultMesh";
import { Texture } from "../../gpu/texture";

export class Launcher {
    constructor(os: OS, appManager: AppManager) {
        os.registerApp({
            appName: "Launcher",
            iconImage: null,
            create: (app: App) => {
                var firstApp = true;

                var appIcons = new Array<MeshObject>()
                var hitRes = new HitResult()
                // var screen = DefaultMesh.createCube(os.device)
                // screen.position.y = 1
                // app.scene.addChild(screen)
                app.castRay = (ray, result) => {
                    Hit.rayIntersectsMeshes(ray, appIcons, result)
                }


                app.update = (delta, cur, controllers) => {
                    controllers.forEach((c) => {
                        if (c.primaryButton.justDown) {
                            console.log("Trying to hit sphere")
                            hitRes.reset()
                            Hit.rayIntersectsMeshes(c.ray, appIcons, hitRes)
                            if (hitRes.hitObject) {
                                console.log("HIT SPHERE")
                                var pe = hitRes.hitObject.getComponent<PointerEventComponent>(PointerEventComponent.type)
                                if (pe) {
                                    pe.click()
                                }
                            }
                        }
                    })
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
                    appIcon.transform.position.z = 2

                    var c = new PointerEventComponent()
                    c.onClick = () => {
                        var appContainer = appManager.createApp()

                        appSpec.create(appContainer.app)
                    }
                    appIcon.addComponent(c)

                    app.scene.transform.addChild(appIcon.transform)
                    appIcons.push(appIcon)

                    appIcons.forEach((icon, i) => {
                        var mid = appIcons.length / 2
                        var offset = i + 0.5 - mid
                        icon.transform.position.x = offset * 0.4
                    })

                    if (firstApp) {
                        console.log("launch!")
                        c.onClick()
                        firstApp = false;
                    }
                    // var appContainer = appManager.createApp()

                    // appSpec.create(appContainer.app)
                }
            }
        })
    }
}