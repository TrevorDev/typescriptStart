import { OS } from "./os/os";
import { RenderWindow } from "./gpu/renderWindow";
import { XR } from "./xr/xr";
import { MultiviewTexture } from "./gpu/multiviewTexture";
import { GPUDevice } from "./gpu/gpuDevice";
import { XRCamera } from "./xr/xrCamera";
import { DefaultVertexData } from "./defaultHelpers/defaultVertexData";
import { CustomProgram } from "./gpu/customProgram";
import { DefaultShaders } from "./defaultHelpers/defaultShaders";
import { MaterialA } from "./sceneGraph/materialA";
import { LightObject } from "./composableObject/baseObjects/lightObject";
import { MeshObject } from "./composableObject/baseObjects/meshObject";
import { Texture } from "./gpu/texture";
import { Vector3 } from "./math/vector3";


// async function main() {
//   var os = new OS()
// }
// main();
var inVR = false
var device = new GPUDevice();
var eyeWidth = 0;
var eyeHeight = 0;
var multiviewTexture: any = null
var display: any = null
var useM = false

document.onclick = (async () => {
  console.log("hit")
  if (inVR) {
    console.log(useM)
    var leftEye = display.getEyeParameters('left');
    var rightEye = display.getEyeParameters('right');
    eyeWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth);
    eyeHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight);
    multiviewTexture = new MultiviewTexture(device, eyeWidth, eyeHeight, useM)
    device.canvasElement.width = eyeWidth * 2;
    device.canvasElement.height = eyeHeight;

    useM = !useM
    return
  }
  inVR = true

  var renderWindow = new RenderWindow(device)

  var camera = new XRCamera()


  display = (await navigator.getVRDisplays())[0]
  display.depthNear = 0.1;
  display.depthFar = 1024.0;

  var leftEye = display.getEyeParameters('left');
  var rightEye = display.getEyeParameters('right');

  eyeWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth);
  eyeHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight)

  device.canvasElement.width = eyeWidth * 2;
  device.canvasElement.height = eyeHeight;

  var attributes = {
    depth: true,
    multiview: true,
    foveationLevel: 3,
  };
  await (display as any).requestPresent([{ source: device.canvasElement, attributes: attributes }])

  console.log("DONE START")


  multiviewTexture = new MultiviewTexture(device, eyeWidth, eyeHeight)

  var lights = [new LightObject()]
  lights[0].transform.position.z = 5;
  lights[0].transform.position.x = 10;
  lights[0].transform.position.y = 10;

  var quad = DefaultVertexData.createFullScreenQuad(device)
  var fullScreenQuadProg = new CustomProgram(device, DefaultShaders.quadVertShader, DefaultShaders.multiviewBlitToTextureFragShader)

  // var material = new MaterialA(device)
  // material.diffuseTexture = Texture.
  var mesh = new MeshObject(device)
  mesh.transform.scale.scaleInPlace(0.2)
  mesh.transform.position.z = -1
  mesh.transform.rotation.fromEuler(new Vector3(Math.PI / 4, 0, 0))
  mesh.transform.computeWorldMatrix()

  // Start draw
  var frameData = new VRFrameData();

  device.gl.clearColor(0.1, 0.2, 0.3, 1.0)

  var loop = () => {
    display.requestAnimationFrame(loop)

    if (display.getFrameData(frameData)) {
      camera.updateFromFrameData(frameData)
      //camera.computeWorldMatrix()
    }

    device.gl.bindFramebuffer(device.gl.DRAW_FRAMEBUFFER, multiviewTexture.frameBuffer)
    device.gl.disable(device.gl.SCISSOR_TEST);
    eyeWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth);
    eyeHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight);
    device.canvasElement.width = eyeWidth * 2;
    device.canvasElement.height = eyeHeight;
    device.gl.viewport(0, 0, multiviewTexture.width, multiviewTexture.height)
    device.gl.clear(device.gl.COLOR_BUFFER_BIT | device.gl.DEPTH_BUFFER_BIT | device.gl.STENCIL_BUFFER_BIT);

    // Load material program
    mesh.material.material.load()
    mesh.material.material.updateFromCamera(camera)
    mesh.material.material.updateForLights(lights)

    // Load mesh.material.material instance specific data
    mesh.material.material.updateUniforms()
    mesh.material.material.updateAndDrawForMesh(mesh.mesh)
    device.gl.invalidateFramebuffer(device.gl.FRAMEBUFFER, [device.gl.DEPTH_ATTACHMENT]);

    device.gl.bindFramebuffer(device.gl.DRAW_FRAMEBUFFER, null)
    device.gl.disable(device.gl.SCISSOR_TEST);
    device.gl.viewport(0, 0, device.canvasElement.width, device.canvasElement.height)


    device.gl.clear(device.gl.COLOR_BUFFER_BIT | device.gl.DEPTH_BUFFER_BIT | device.gl.STENCIL_BUFFER_BIT);


    fullScreenQuadProg.load()
    fullScreenQuadProg.updateUniforms({ debug: false });
    fullScreenQuadProg.setTextures({ imgs: multiviewTexture })
    fullScreenQuadProg.draw(quad)
    display.submitFrame();
  }
  display.requestAnimationFrame(loop)


})