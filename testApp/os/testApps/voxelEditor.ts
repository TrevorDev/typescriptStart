import { OS } from "../os"
import { App } from "../app/app"
import { Color } from "../../math/color"
import { MeshObject } from "../../componentObject/baseObjects/meshObject"
import { Vector3 } from "../../math/vector3"
import { Matrix4 } from "../../math/matrix4"

var os = OS.GetOS()
os.registerApp({
    appName: "Voxel editor",
    iconImage: "/public/img/video.png",
    create: (app: App) => {
        var voxels: any = {}
        var addVoxel = (x: number, y: number, color: Color) => {
            voxels[x + " " + y] = { block: null };
        }

        var right = new MeshObject(os.device)
        right.transform.scale.scaleInPlace(0.03)
        app.scene.transform.addChild(right.transform)

        var left = new MeshObject(os.device)
        left.transform.scale.scaleInPlace(0.03)
        app.scene.transform.addChild(left.transform)

        var tmpVec = new Vector3()
        var tmpMat = new Matrix4()


        app.update = (delta) => {
            os.inputManager.controllers.forEach((c) => {
                if (c.hand != "left") {
                    right.transform.position.copyFrom(c.ray.origin)
                    tmpVec.copyFrom(c.ray.direction)
                    tmpVec.scaleInPlace(0.3);
                    right.transform.position.addToRef(tmpVec, right.transform.position)

                    app.scene.transform.worldMatrix.inverseToRef(tmpMat)
                    right.transform.position.rotateByMatrixToRef(tmpMat, right.transform.position)

                    if (c.primaryButton.justDown) {
                        var voxel = new MeshObject(os.device)
                        voxel.transform.scale.scaleInPlace(0.03)
                        app.scene.transform.addChild(voxel.transform)
                        voxel.transform.position.copyFrom(right.transform.position)
                    }
                }
            })
        }

        app.dispose = () => {

        }
    }
})