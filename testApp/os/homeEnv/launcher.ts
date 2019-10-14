import { OS } from "../os";
import { App } from "../app/app";
import { AppSpec } from "../app/appSpec";
import { Hit, HitResult } from "../../extensions/hit";
import { MeshObject } from "../../componentObject/baseObjects/meshObject";
import { PointerEventComponent } from "../../componentObject/components/behavior/pointerEventComponent";
import { AppManager } from "../app/appManager";

export class Launcher {
    constructor(os: OS, appManager: AppManager) {
        os.registerApp({
            appName: "Launcher",
            iconImage: null,
            create: (app: App) => {
                var appSpheres = new Array<MeshObject>()
                var hitRes = new HitResult()
                // var screen = DefaultMesh.createCube(os.device)
                // screen.position.y = 1
                // app.scene.addChild(screen)
                app.castRay = (ray, result) => {
                    Hit.rayIntersectsMeshes(ray, appSpheres, result)
                }


                app.update = (delta, cur, controllers) => {
                    controllers.forEach((c) => {
                        if (c.primaryButton.justDown) {
                            console.log("Trying to hit sphere")
                            hitRes.reset()
                            Hit.rayIntersectsMeshes(c.ray, appSpheres, hitRes)
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

                (app as any).registerApp = (appSpec: AppSpec) => {
                    var appSphere = new MeshObject(os.device)//DefaultMesh.createSphere(os.device);
                    appSphere.transform.scale.scaleInPlace(0.3)
                    appSphere.transform.position.y = appSphere.transform.scale.y / 2

                    var c = new PointerEventComponent()
                    c.onClick = () => {
                        var appContainer = appManager.createApp()

                        appSpec.create(appContainer.app)
                    }
                    appSphere.addComponent(c)

                    app.scene.transform.addChild(appSphere.transform)
                    appSpheres.push(appSphere)
                }
            }
        })
    }
}