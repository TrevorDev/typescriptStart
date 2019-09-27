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
import { Ray } from "./math/ray";
import { Vector3 } from "./math/vector3";
import { Hit, HitResult } from "./defaultHelpers/hit";


async function main() {
  var stage = new Stage();

  // Create meshes
  for (var i = 0; i < 2; i++) {
    var mesh = DefaultMesh.createCylinder(stage.device)
    stage.meshes.push(mesh)
    mesh.position.set(0, -1, -5 - (i * 1.5))
  }
  // stage.meshes[1].rotation.fromEuler(new Vector3(Math.PI / 2, 0, 0))
  // stage.meshes[1].computeWorldMatrix(true)
  var forward = new Ray()
  var euler = new Vector3()
  //euler.y += 0.003
  stage.renderLoop = (deltaTime: number) => {
    // Update meshes
    //stage.meshes[0].position.x -= 0.2 * deltaTime
    //stage.meshes[0].rotation.
    euler.y += 0.5 * deltaTime
    stage.meshes[0].rotation.fromEuler(euler)
    stage.meshes[0].computeWorldMatrix(true)
    stage.meshes[0].forwardToRef(forward)
    //console.log(forward.direction.v)
    //stage.meshes[0].rotation.toEulerRef(euler)
    //euler.y += 0.1 * deltaTime
    //console.log(forward.direction.v)

    //console.log(forward)
    var hitResult = new HitResult()
    var x = Hit.rayIntersectsMesh(forward, stage.meshes[1], hitResult)
    console.log(hitResult)
  }

  document.onkeydown = () => {
    i++
    var mesh = DefaultMesh.createCylinder(stage.device)
    stage.meshes.push(mesh)
    mesh.position.set(i * 0.5, -1, -5 - (i * 1.5))
    //console.log(i)
  }
}
main();