import { OS } from "../os"
import { App } from "../app/app"
import { CanvasTexture } from "../../extensions/canvasTexture"
import { BasicMaterial } from "../../componentObject/components/material/basicMaterial"
import { DefaultMesh } from "../../extensions/defaultMesh"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { Vector3 } from "../../math/vector3"

var os = OS.GetOS()
os.registerApp({
    appName: "Clock",
    iconImage: "/public/img/clock.png",
    create: (app: App) => {
        var input = os.getInputManager()

        // Create canvas element to draw text to
        var canEl = document.createElement('canvas')
        canEl.width = 512 * 2
        canEl.height = 128 * 2
        var ctx = canEl.getContext("2d")!

        var canvasTexture = new CanvasTexture(os.device, canEl)

        var mat = new BasicMaterial(os.device)
        mat.diffuseTexture = canvasTexture.texture

        var screen = DefaultMesh.createMesh(os.device, { vertexData: DefaultVertexData.createPlaneVertexData(os.device), material: mat });
        screen.transform.scale.x = canEl.width / canEl.height
        screen.transform.scale.scaleInPlace(0.2)
        screen.transform.position.y = screen.transform.scale.z / 2 + 0.05
        app.scene.transform.addChild(screen.transform)
        var euler = new Vector3(0, 0, 0)
        euler.x = Math.PI / 2
        screen.transform.rotation.fromEuler(euler)

        var frameArray = new Array<number>()
        var frameIndex = 0
        var frameSum = 0
        var framesToWatch = 120
        app.update = (delta) => {
            if (frameArray.length < framesToWatch) {
                frameArray.push(delta)
                frameSum += delta
            } else {
                frameSum -= frameArray[frameIndex]
                frameSum += delta
                frameArray[frameIndex] = delta
                frameIndex = (frameIndex + 1) % framesToWatch
            }

            //euler.x += Math.PI / 3 * delta
            euler.x = Math.PI / 2
            screen.transform.rotation.fromEuler(euler)

            // Get time
            var time = new Date()
            var clockTime = time.toLocaleTimeString()//time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

            // Draw text
            var size = 50 * 2
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canEl.width, canEl.height)
            //ctx.clearRect(0, 0, canEl.width, canEl.height)
            ctx.fillStyle = '#ecf0f1';
            ctx.font = size + 'px serif';
            var dim = ctx.measureText("M")
            ctx.fillText("" + clockTime, 10, dim.width);
            ctx.fillText("FPS: " + (Math.floor(10 / (frameSum / frameArray.length)) / 10).toFixed(1), 10, dim.width * 2 + 10);
            canvasTexture.update()
        }

        app.dispose = () => {

        }
    }
})