import { Vector3 } from "../../math/vector3"
import { Color } from "../../math/color"

export class VoxelFile {
    size = 0.03
    voxels = new Array<{ position: Vector3, color: Color }>()
}

export class Filesystem {
    storage: Storage
    constructor() {
        this.storage = window.localStorage

        var file = new VoxelFile()
        file.voxels.push({ position: new Vector3(0, 0, 0), color: new Color(1, 0, 0) })
        console.log(file.voxels[0].position)
        this.saveVoxelFile(file)

    }

    saveVoxelFile(file: VoxelFile) {
        this.storage.voxelFile = JSON.stringify(file)
        console.log(this.storage)
    }

    getVoxelFile() {
        if (!this.storage.voxelFile) {
            return null
        } else {
            return JSON.parse(this.storage.voxelFile) as VoxelFile
        }
    }
}