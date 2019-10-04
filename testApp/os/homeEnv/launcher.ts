import { OS } from "../os";
import { App } from "../app/app";
import { DefaultMesh } from "../../defaultHelpers/defaultMesh";
import { AppSpec } from "../app/appSpec";
import { Mesh } from "../../sceneGraph/mesh";
import { Hit } from "../../defaultHelpers/hit";

export class Launcher {
    constructor(os: OS) {
        os.registerApp({
            appName: "Launcher",
            iconImage: null,
            create: (app: App) => {
                var appSpheres = new Array<Mesh>()
                // var screen = DefaultMesh.createCube(os.device)
                // screen.position.y = 1
                // app.scene.addChild(screen)
                app.castRay = (ray, result) => {
                    Hit.rayIntersectsMeshes(ray, appSpheres, result)
                    console.log(result.hitDistance)
                }


                app.update = (delta) => {
                }

                app.dispose = () => {

                }

                (app as any).registerApp = (appSpec: AppSpec) => {

                    console.log(appSpec.appName)

                    var appSphere = DefaultMesh.createSphere(os.device);
                    app.scene.addChild(appSphere)
                    appSpheres.push(appSphere)

                    // var container = os.appManager.createApp()
                    // os.launcherApp = container
                    // container.containerSpace.position.z = -10
                    // appSpec.create(container.app)
                }
            }
        })
    }
}