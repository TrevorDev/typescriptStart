import { OS } from "../os"
import { App } from "../app/app"
import { BasicMaterial } from "../../componentObject/components/material/basicMaterial"
import { DefaultMesh } from "../../extensions/defaultMesh"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { Vector3 } from "../../math/vector3"
import { VideoTexture } from "../../extensions/videoTexture"

var os = OS.GetOS()
os.registerApp({
    appName: "Video",
    iconImage: "/public/img/video.png",
    create: (app: App) => {

        var screen = DefaultMesh.createMesh(os.device, { vertexData: DefaultVertexData.createPlaneVertexData(os.device) });
        screen.transform.scale.x = 1920 / 1080
        screen.transform.scale.scaleInPlace(0.5)
        screen.transform.position.y = screen.transform.scale.z / 2 + 0.05
        app.scene.transform.addChild(screen.transform)
        var euler = new Vector3(0, 0, 0)
        euler.x = Math.PI / 2
        screen.transform.rotation.fromEuler(euler);

        var vt = new VideoTexture(os.device);
        (screen.material.material as BasicMaterial).diffuseTexture = vt.texture


        vt.videoElement.play()
        app.update = (delta) => {

            vt.update()

        }

        app.dispose = () => {
            vt.dispose();
            screen.dispose();
        }
    }
})