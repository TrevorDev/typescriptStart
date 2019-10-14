import { OS } from "../os"
import { App } from "../app/app"
import { CanvasTexture } from "../../extensions/canvasTexture"
import { BasicMaterial } from "../../componentObject/components/material/basicMaterial"
import { DefaultMesh } from "../../extensions/defaultMesh"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { Vector3 } from "../../math/vector3"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { Texture } from "../../gpu/texture"
import { Color } from "../../math/color"
import { TransformComponent } from "../../componentObject/components/transform/transformComponent"
import { TransformObject } from "../../componentObject/baseObjects/transformObject"

var os = OS.GetOS()
os.registerApp({
    appName: "Blocks",
    iconImage: "/public/img/edit3D.png",
    create: (app: App) => {
        var parent = new TransformObject()
        parent.transform.scale.scaleInPlace(0.05)
        parent.transform.position.y = 0.3
        app.scene.transform.addChild(parent.transform)
        var blocks: Array<any> = []
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    let box = DefaultMesh.createMesh(os.device)
                    box.transform.position.x = i == 0 ? -0.5 : 0.5;
                    box.transform.position.y = j == 0 ? -0.5 : 0.5;
                    box.transform.position.z = k == 0 ? -0.5 : 0.5;

                    var matrial = box.material.material as BasicMaterial;

                    if (i * 4 + j * 2 + k < 1) {
                        var color = Color.createFromHex("#2ecc71");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    } else if (i * 4 + j * 2 + k < 2) {
                        var color = Color.createFromHex("#3498db");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    } else if (i * 4 + j * 2 + k < 3) {
                        var color = Color.createFromHex("#9b59b6");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    } else if (i * 4 + j * 2 + k < 4) {
                        var color = Color.createFromHex("#34495e");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    } else if (i * 4 + j * 2 + k < 5) {
                        var color = Color.createFromHex("#f1c40f");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    } else if (i * 4 + j * 2 + k < 6) {
                        var color = Color.createFromHex("#e67e22");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    } else if (i * 4 + j * 2 + k < 7) {
                        var color = Color.createFromHex("#e74c3c");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    } else if (i * 4 + j * 2 + k < 8) {
                        var color = Color.createFromHex("#ecf0f1");
                        matrial.diffuseTexture = Texture.createFromeSource(os.device, [Math.floor(255 * color.r), Math.floor(255 * color.g), Math.floor(255 * color.b), Math.floor(255 * color.a)]);
                    }
                    blocks.push({ box: box, i: i, j: j, k: k })
                    parent.transform.addChild(box.transform)
                }
            }
        }
        let t = 0;
        var euler = new Vector3()
        app.update = (delta) => {
            t += delta * 1000
            blocks.forEach((block) => {
                var i = block.i
                var j = block.j
                var k = block.k
                var val = (1 + Math.sin(t / 500));

                var dist = 0.5
                block.box.transform.position.set((i == 1 ? val : -val) + (i == 0 ? -dist : dist), (j == 1 ? val : -val) + (j == 0 ? -dist : dist), (k == 1 ? val : -val) + (k == 0 ? -dist : dist));
                block.box.transform.scale.set(1 + val / 2, 1 + val / 2, 1 + val / 2);
                euler.set(0, (j == 1 ? val : -val) / 1, 0)
                block.box.transform.rotation.fromEuler(euler)
            })



        }

        app.dispose = () => {

        }
    }
})