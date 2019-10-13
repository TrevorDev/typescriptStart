import { OS } from "./os/os";
import { RenderWindow } from "./gpu/renderWindow";
import { XR } from "./extensions/xr/xr";
import { MultiviewTexture } from "./gpu/multiviewTexture";
import { GPUDevice } from "./gpu/gpuDevice";
import { XRCamera } from "./extensions/xr/xrCamera";
import { DefaultVertexData } from "./extensions/defaultVertexData";
import { CustomProgram } from "./gpu/customProgram";
import { DefaultShaders } from "./extensions/defaultShaders";
import { BasicMaterial } from "./componentObject/components/material/basicMaterial";
import { LightObject } from "./componentObject/baseObjects/lightObject";
import { MeshObject } from "./componentObject/baseObjects/meshObject";
import { Texture } from "./gpu/texture";
import { Vector3 } from "./math/vector3";
import * as twgl from "twgl.js"


async function main() {
  var os = new OS()
}
main();