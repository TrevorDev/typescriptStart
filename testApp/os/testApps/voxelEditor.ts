import { OS } from "../os"
import { App } from "../app/app"
import { Color } from "../../math/color"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { Vector3 } from "../../math/vector3"
import { Matrix4 } from "../../math/matrix4"
import { ControllerRaySystem } from "../../componentObject/systems/controllerRaySystem"
import { Button } from "../../extensions/ui/button"
import { VoxelFile } from "../filesystem/filesystem"

var os = OS.GetOS()
os.registerApp({
    appName: "Voxel editor",
    iconImage: "/public/img/video.png",
    create: (app: App) => {
        var voxels: { [key: string]: MeshObject } = {}
        // var addVoxel = (x: number, y: number, color: Color) => {
        //     voxels[x + " " + y] = { block: null };
        // }

        var right = new MeshObject(os.device)
        right.transform.scale.scaleInPlace(0.03)
        app.scene.transform.addChild(right.transform)

        var left = new MeshObject(os.device)
        left.transform.scale.scaleInPlace(0.03)
        app.scene.transform.addChild(left.transform)

        var tmpVec = new Vector3()
        var tmpMat = new Matrix4()

        var controllerRaySystem = new ControllerRaySystem(app)

        var saveButton = new Button(os.device, "Save")
        saveButton.mesh.transform.position.x += 0.5
        saveButton.pointerEvent.onClick = () => {
            var voxelFile = new VoxelFile()
            voxelFile.size = 0.03
            for (var key in voxels) {
                voxelFile.voxels.push({ position: voxels[key].transform.position, color: new Color(0, 0, 0, 1) })
            }
            os.filesystem.saveVoxelFile(voxelFile)
        }
        app.scene.transform.addChild(saveButton.mesh.transform)
        saveButton.mesh.transform.position.y += 0.13

        var clearButton = new Button(os.device, "Clear")
        clearButton.mesh.transform.position.x += 0.5
        clearButton.pointerEvent.onClick = () => {
            for (var key in voxels) {
                app.scene.transform.removeChild(voxels[key].transform)
            }
            voxels = {}
        }
        app.scene.transform.addChild(clearButton.mesh.transform)

        controllerRaySystem.hitable.push(saveButton.mesh)
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

                    right.transform.position.scaleInPlace(1 / (voxelSize))
                    right.transform.position.x = Math.round(right.transform.position.x)
                    right.transform.position.y = Math.round(right.transform.position.y)
                    right.transform.position.z = Math.round(right.transform.position.z)
                    right.transform.position.scaleInPlace((voxelSize))

                    // Make not visible when over a button
                    if ((controllerRaySystem.castResults[c.hand] && controllerRaySystem.castResults[c.hand].hitDistance) || c.hoveredTaskbar) {
                        right.mesh.visible = false
                        return
                    }
                    right.mesh.visible = true

                    if (c.primaryButton.justDown) {
                        var voxel = new MeshObject(os.device)
                        voxel.transform.scale.scaleInPlace(voxelSize)
                        app.scene.transform.addChild(voxel.transform)
                        voxel.transform.position.copyFrom(right.transform.position)
                        voxels[Object.keys(voxels).length] = voxel
                    }
                }
            })
        }

        app.dispose = () => {

        }
    }
})