import { OS } from "../os"
import { App } from "../app/app"
import { Color } from "../../math/color"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { Vector3 } from "../../math/vector3"
import { Matrix4 } from "../../math/matrix4"
import { ControllerRaySystem } from "../../componentObject/systems/controllerRaySystem"
import { Button } from "../../extensions/ui/button"
import { VoxelFile } from "../filesystem/filesystem"
import { BasicMaterial } from "../../componentObject/components/material/basicMaterial"
import { Texture } from "../../gpu/texture"

var os = OS.GetOS()
os.registerApp({
    appName: "Voxel editor",
    iconImage: "/public/img/video.png",
    create: (app: App) => {
        var voxels: { [key: string]: MeshObject } = {}

        var right = new MeshObject(os.device)
        right.transform.scale.scaleInPlace(0.01)
        app.scene.transform.addChild(right.transform)

        // var left = new MeshObject(os.device)
        // left.transform.scale.scaleInPlace(0.03)
        // app.scene.transform.addChild(left.transform)

        var tmpVec = new Vector3()
        var tmpMat = new Matrix4()

        var controllerRaySystem = new ControllerRaySystem(app)

        // Colors
        var colors: { [key: string]: Color } = {}
        colors["Green"] = Color.createFromHex("#1abc9c")
        colors["Blue"] = Color.createFromHex("#3498db")
        colors["Purple"] = Color.createFromHex("#9b59b6")
        colors["Black"] = Color.createFromHex("#2c3e50")
        colors["Yellow"] = Color.createFromHex("#f1c40f")
        colors["Orange"] = Color.createFromHex("#e67e22")
        colors["Red"] = Color.createFromHex("#e74c3c")
        colors["White"] = Color.createFromHex("#ecf0f1")
        colors["Gray"] = Color.createFromHex("#95a5a6")
        var activeColor = colors["White"]
        var index = 0
        for (let name in colors) {
            index++
            var colorButton = new Button(os.device, name)
            colorButton.mesh.transform.position.x -= 0.3
            colorButton.mesh.transform.scale.scaleInPlace(0.2)
            colorButton.backgroundColor.copyFrom(colors[name])
            colorButton.backgroundColor.scaleInPlace(0.7)
            colorButton.hoveredBackgroundColor.copyFrom(colors[name])
            colorButton.hoveredBackgroundColor.scaleInPlace(0.9)
            colorButton.pointerEvent.onClick = () => {
                activeColor = colors[name]
            }
            app.scene.transform.addChild(colorButton.mesh.transform)
            colorButton.mesh.transform.position.y = 0.2 - (0.03 * index)
            controllerRaySystem.hitable.push(colorButton.mesh)
            colorButton.update()
        }


        // Save/clear
        var saveButton = new Button(os.device, "Save")
        saveButton.mesh.transform.position.x += 0.5
        saveButton.pointerEvent.onClick = () => {
            var voxelFile = new VoxelFile()
            voxelFile.size = 0.03
            for (var key in voxels) {
                voxelFile.voxels.push({ position: voxels[key].transform.position, color: (voxels[key].material.material as BasicMaterial).diffuseColor! })
            }
            os.filesystem.saveVoxelFile(voxelFile)
        }
        app.scene.transform.addChild(saveButton.mesh.transform)
        saveButton.mesh.transform.position.y += 0.13
        controllerRaySystem.hitable.push(saveButton.mesh)

        var clearButton = new Button(os.device, "Clear")
        clearButton.mesh.transform.position.x += 0.5
        clearButton.pointerEvent.onClick = () => {
            for (var key in voxels) {
                app.scene.transform.removeChild(voxels[key].transform)
            }
            voxels = {}
        }
        app.scene.transform.addChild(clearButton.mesh.transform)
        controllerRaySystem.hitable.push(clearButton.mesh)


        app.castRay = (controller, result) => {
            controllerRaySystem.castRay(controller, result)
        }

        var voxelSize = 0.03
        app.update = (delta) => {
            controllerRaySystem.update(os.inputManager.controllers)
            if (!os.appManager.isActiveForApp(app)) {
                right.mesh.visible = false
                return
            }

            os.inputManager.controllers.forEach((c) => {
                if (c.hand != "left") {
                    right.transform.position.copyFrom(c.ray.origin)
                    tmpVec.copyFrom(c.ray.direction)
                    tmpVec.scaleInPlace(0.3);
                    right.transform.position.addToRef(tmpVec, right.transform.position)

                    app.scene.transform.worldMatrix.inverseToRef(tmpMat)
                    right.transform.position.rotateByMatrixToRef(tmpMat, right.transform.position)



                    // Make not visible when over a button
                    if ((controllerRaySystem.castResults[c.hand] && controllerRaySystem.castResults[c.hand].hitDistance) || c.hoveredTaskbar) {
                        right.mesh.visible = false
                        return
                    }
                    right.mesh.visible = true

                    if (c.primaryButton.justDown) {
                        var mat = new BasicMaterial(os.device)
                        mat.diffuseColor = new Color()
                        mat.diffuseColor.copyFrom(activeColor)
                        mat.diffuseTexture = Texture.createFromColor(os.device, mat.diffuseColor)

                        var voxel = new MeshObject(os.device, mat)
                        voxel.transform.scale.scaleInPlace(voxelSize)
                        app.scene.transform.addChild(voxel.transform)
                        voxel.transform.position.copyFrom(right.transform.position)

                        voxel.transform.position.scaleInPlace(1 / (voxelSize))
                        voxel.transform.position.x = Math.round(voxel.transform.position.x)
                        voxel.transform.position.y = Math.round(voxel.transform.position.y)
                        voxel.transform.position.z = Math.round(voxel.transform.position.z)
                        voxel.transform.position.scaleInPlace((voxelSize))

                        voxels[Object.keys(voxels).length] = voxel
                    }
                }
            })
        }

        app.dispose = () => {

        }
    }
})