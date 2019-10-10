import { OS } from "../os";
import { App } from "../app/app";
import { DefaultMesh } from "../../defaultHelpers/defaultMesh";
import { AppSpec } from "../app/appSpec";
import { Mesh } from "../../sceneGraph/mesh";
import { Hit } from "../../defaultHelpers/hit";
import { MeshObject } from "../../composableObject/baseObjects/meshObject";

export class Launcher {
    constructor(os: OS) {
        os.registerApp({
            appName: "Launcher",
            iconImage: null,
            create: (app: App) => {
                var appSpheres = new Array<MeshObject>()
                // var screen = DefaultMesh.createCube(os.device)
                // screen.position.y = 1
                // app.scene.addChild(screen)
                app.castRay = (ray, result) => {
                    Hit.rayIntersectsMeshes(ray, appSpheres, result)
                }


                app.update = (delta) => {
                }

                app.dispose = () => {

                }

                (app as any).registerApp = (appSpec: AppSpec) => {

                    var appSphere = new MeshObject(os.device)//DefaultMesh.createSphere(os.device);
                    appSphere.transform.scale.scaleInPlace(0.3)
                    appSphere.transform.position.y = appSphere.transform.scale.y / 2

                    app.scene.transform.addChild(appSphere.transform)
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