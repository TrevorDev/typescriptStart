import { RenderWindow } from "./gpu/renderWindow";
import { GPUDevice } from "./gpu/gpuDevice";
import { Texture } from "./gpu/texture";
import { Mesh } from "./sceneGraph/mesh";
import { DefaultVertexData } from "./defaultHelpers/defaultVertexData";
import { PointLight } from "./sceneGraph/pointLight";
import { Renderer } from "./sceneGraph/renderer";
import { MaterialA } from "./sceneGraph/materialA";
import { CustomProgram } from "./gpu/customProgram";
import { XR, XRState } from "./xr/xr";
import { Loop } from "./sceneGraph/loop";
import { XRCamera } from "./xr/xrCamera";
import { DefaultShaders } from "./defaultHelpers/defaultShaders";
import { VideoTexture } from "./defaultHelpers/videoTexture";
import { Stage } from "./defaultHelpers/stage";
import { DefaultMesh } from "./defaultHelpers/defaultMesh";


async function main() {
  var stage = new Stage();

  // Create meshes
  for (var i = 0; i < 2; i++) {
    var mesh = DefaultMesh.createSphere(stage.device)
    stage.meshes.push(mesh)
    mesh.position.set(i * 0.2, 0, -5 - i)
  }

  stage.renderLoop = (deltaTime: number) => {
    // Update meshes
    stage.meshes[0].position.y += 0.2 * deltaTime
  }

  document.onkeydown = () => {
    i++
    var mesh = DefaultMesh.createSphere(stage.device)
    stage.meshes.push(mesh)
    mesh.position.set(i * 0.2, 0, -5 - i)
    console.log(i)
  }
}
main();