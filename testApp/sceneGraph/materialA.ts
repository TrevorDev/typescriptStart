
import * as twgl from "twgl.js"
import { Material } from "./material";
import { DefaultShaders } from "../defaultHelpers/defaultShaders";
import { GPUDevice } from "../gpu/gpuDevice";
import { Camera } from "./camera";
import { TransformNode } from "./transformNode";
import { Mesh } from "./mesh";
import { Texture } from "../gpu/texture";
import { PointLight } from "./pointLight";
import { Vector3 } from "../math/vector3";
import { Matrix4 } from "../math/matrix4";
import { XRCamera } from "../xr/xrCamera";

// export class StandardMaterialFactory {
//     createInstance(){
//         return new StandardMaterial()
//     }
// }

export class MaterialA implements Material {
    programInfo: twgl.ProgramInfo
    viewUboInfo: twgl.UniformBlockInfo
    lightUboInfo: twgl.UniformBlockInfo
    materialUboInfo: twgl.UniformBlockInfo
    modelUboInfo: twgl.UniformBlockInfo
    diffuseTexture: null | Texture = null
    lightingAmount = 1;
    tmpMat = new Matrix4()
    constructor(public device: GPUDevice) {
        this.programInfo = twgl.createProgramInfo(device.gl, [DefaultShaders.vertShaderA.str, DefaultShaders.fragShaderA.str])

        this.lightUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Lights[0]");
        this.viewUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "View");

        this.materialUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Material");
        twgl.setBlockUniforms(this.materialUboInfo, {
            u_ambient: [0, 0, 0, 1],
            u_specular: [1, 1, 1, 1],
            u_shininess: 100,
            u_specularFactor: 0.8,
        });
        twgl.setUniformBlock(device.gl, this.programInfo, this.materialUboInfo);
        //materialUboInfos.push(materialUbo);

        this.modelUboInfo = twgl.createUniformBlockInfo(device.gl, this.programInfo, "Model");
        var m4 = twgl.m4
        const world = m4.translation([0, 0, 0]);
        //m4.setTranslation())
        twgl.setBlockUniforms(this.modelUboInfo, {
            u_world: world,
            u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
        });
        twgl.setUniformBlock(device.gl, this.programInfo, this.modelUboInfo);
    }

    load() {
        this.device.gl.useProgram(this.programInfo.program);
    }
    updateFromCamera(camera: XRCamera) {
        camera.leftEye.projection.multiplyToRef(camera.leftEye.view, this.tmpMat)
        this.tmpMat.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionL)

        camera.rightEye.projection.multiplyToRef(camera.rightEye.view, this.tmpMat)
        this.tmpMat.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionR)


        // camera.viewInverse.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewInverseL)
        // camera.viewProjection.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionL)
        // camera.viewInverse.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewInverseR)
        // camera.viewProjectionR.copyToArrayBufferView(this.viewUboInfo.uniforms.u_viewProjectionR)
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.viewUboInfo);
    }
    updateForLights(lights: Array<TransformNode>) {
        // TODO fix all this
        var light = lights[0] as PointLight
        var tmp = new Vector3()
        light.worldMatrix.decompose(tmp)
        //debugger
        twgl.setBlockUniforms(this.lightUboInfo, {
            u_lightColor: [light.color.v[0], light.color.v[1], light.color.v[2], 1],
            u_lightWorldPos: [tmp.x, tmp.y, tmp.z],
        });
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.lightUboInfo);
    }
    updateUniforms() {
        this.setTextures({
            u_diffuse: this.diffuseTexture!,
        })

        twgl.setBlockUniforms(this.materialUboInfo, {
            u_ambient: [0, 0, 0, 1],
            u_specular: [0.2, 0.2, 0.2, 1],
            u_shininess: 100,
            u_specularFactor: 0.8,
        });
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.materialUboInfo);
    }
    setTextures(textures: { [key: string]: Texture }) {
        var u: any = {}
        for (var key in textures) {
            u[key] = textures[key].glTexture
        }
        twgl.setUniforms(this.programInfo, u);
    }
    updateAndDrawForMesh(mesh: Mesh) {
        //this.device.gl.cullFace(this.device.gl.FRONT_FACE)

        twgl.setBuffersAndAttributes(this.device.gl, this.programInfo, mesh.vertData.gpuBufferInfo); // Set object vert data

        // Set world matrix and inverse transpose
        mesh.worldMatrix.copyToArrayBufferView(this.modelUboInfo.uniforms.u_world)
        mesh.worldMatrix.inverseToRef(this.tmpMat)
        this.tmpMat.transposeToRef(this.tmpMat)
        this.tmpMat.copyToArrayBufferView(this.modelUboInfo.uniforms.u_worldInverseTranspose)
        twgl.setUniformBlock(this.device.gl, this.programInfo, this.modelUboInfo);

        twgl.bindUniformBlock(this.device.gl, this.programInfo, this.modelUboInfo);  // model position
        twgl.drawBufferInfo(this.device.gl, mesh.vertData.gpuBufferInfo);
    }
}