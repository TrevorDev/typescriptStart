import { Mesh } from "../../sceneGraph/mesh"
import { Vector3 } from "../../math/vector3"
import { OS } from "../os"
import { DefaultMesh } from "../../defaultHelpers/defaultMesh"
import { MaterialA } from "../../sceneGraph/materialA"
import { Texture } from "../../gpu/texture"
import { CanvasTexture } from "../../defaultHelpers/canvasTexture"

var main = async () => {
    var os = OS.GetOS()
    var input = os.getInputManager()
    var app = os.createApp()

    // Create canvas element to draw text to
    var canEl = document.createElement('canvas')
    canEl.width = 512 * 2
    canEl.height = 128 * 2
    var ctx = canEl.getContext("2d")!

    // Debug overlay canvas
    // document.body.appendChild(canEl)
    // canEl.style.position = "absolute"
    // canEl.style.zIndex = "20"
    // canEl.style.top = "0px"

    // Create texture from the canvas
    // var texture = new THREE.CanvasTexture(canEl)
    // texture.needsUpdate = true

    // // Setup mesh to render text to
    // var screenGeom = new THREE.PlaneGeometry(1, 128 / 512);
    // var screenMat = new THREE.MeshLambertMaterial({ map: texture });
    // screenMat.transparent = true

    var canvasTexture = new CanvasTexture(os.device, canEl)

    var mat = new MaterialA(os.device)
    mat.diffuseTexture = canvasTexture.texture

    var screen = DefaultMesh.createPlane(os.device)
    screen.material = mat
    screen.position.y = 1
    app.scene.addChild(screen)
    var euler = new Vector3(0, 0, 0)



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

        euler.x += Math.PI / 3 * delta
        screen.rotation.fromEuler(euler)

        // Get time
        var time = new Date()
        var clockTime = time.toLocaleTimeString()//time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

        // Draw text
        var size = 50 * 2
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canEl.width, canEl.height)
        //ctx.clearRect(0, 0, canEl.width, canEl.height)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = size + 'px serif';
        var dim = ctx.measureText("M")
        ctx.fillText("" + clockTime, 10, dim.width);
        ctx.fillText("FPS: " + (Math.floor(10000 / (frameSum / frameArray.length)) / 10).toFixed(1), 10, dim.width * 2 + 10);
        canvasTexture.update()
    }



}
main()