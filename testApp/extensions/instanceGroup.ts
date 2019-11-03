import { DefaultVertexData } from "./defaultVertexData";
import { GPUDevice } from "../gpu/gpuDevice";
import { VertexData } from "../gpu/vertexData";
import { Material } from "../componentObject/components/material/material";
import { InstancedBasicMaterial } from "../componentObject/components/material/instancedBasicMaterial";
import * as twgl from "twgl.js"

// TODO do i need twgl.addExtensionsToContext(gl); ?
export class InstanceGroup {
    instanceWorlds: Float32Array
    vertexData: VertexData
    material: Material
    constructor(device: GPUDevice, public numInstances = 100) {
        this.material = new InstancedBasicMaterial(device)
        this.instanceWorlds = new Float32Array(numInstances * 16);

        var m4 = twgl.m4
        for (let i = 0; i < numInstances; ++i) {
            const mat = new Float32Array(this.instanceWorlds.buffer, i * 16 * 4, 16);
            m4.translation([0, 2, -10], mat);
        }

        // TODO also support instanced colors/textures in materials
        this.vertexData = DefaultVertexData.createCubeVertexData(device, {
            instanceWorld: {
                numComponents: 16,
                data: this.instanceWorlds,
                divisor: 1,
            }
        })
    }
}