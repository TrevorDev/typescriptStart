import { Mesh } from "../../sceneGraph/mesh"
import { Vector3 } from "../../math/vector3"
import { OS } from "../os"
import { DefaultMesh } from "../../defaultHelpers/defaultMesh"
import { MaterialA } from "../../sceneGraph/materialA"
import { Texture } from "../../gpu/texture"
import { CanvasTexture } from "../../defaultHelpers/canvasTexture"
import { App } from "../app/app"


var main = async () => {
    var os = OS.GetOS()
    os.registerApp({
        appName: "Launcher",
        iconImage: null,
        create: (app: App) => {
            var screen = DefaultMesh.createCube(os.device)
            screen.position.y = 1
            app.scene.addChild(screen)

            app.update = (delta) => {
            }

            app.dispose = () => {

            }

            (app as any).registerApp = (appSpec: any) => {

            }
        }
    })
}
main()