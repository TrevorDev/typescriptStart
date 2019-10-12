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
import * as twgl from "twgl.js"


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





// var device = new GPUDevice();
// var w = new RenderWindow(device);

// var quad = DefaultVertexData.createFullScreenQuad(device)
// var fullScreenQuadProg = new CustomProgram(device, DefaultShaders.quadVertShader, DefaultShaders.multiviewBlitToTextureFragShader);
// ;
// (async function () {
//   "use strict";

//   var vrDisplay = null;
//   var frameData = null;
//   var projectionMat = mat4.create();
//   var viewMat = mat4.create();

//   var vrPresentButton = null;
//   var is_multiview = false;

//   // ===================================================
//   // WebGL scene setup. This code is not WebVR specific.
//   // ===================================================

//   // WebGL setup.
//   var webglCanvas = w.canvasElement

//   var gl = device.gl
//   if (!gl) {
//     VRSamplesUtil.addError("Your browser does not support WebGL2.");
//     return;
//   }
//   var samples = gl.getParameter(gl.MAX_SAMPLES);

//   var is_multiview, is_multisampled = false;
//   var ext = gl.getExtension('OCULUS_multiview');
//   if (ext) {
//     console.log("OCULUS_multiview extension is supported");
//     is_multiview = true;
//     is_multisampled = true;
//   }
//   else {
//     console.log("OCULUS_multiview extension is NOT supported");
//     ext = gl.getExtension('OVR_multiview2');
//     if (ext) {
//       console.log("OVR_multiview2 extension is supported");
//       is_multiview = true;
//     }
//     else {
//       console.log("Neither OCULUS_multiview nor OVR_multiview2 extension is NOT supported");
//       is_multiview = false;
//     }
//   }

//   var fbo = null;
//   var leftEye;
//   var rightEye;
//   var backFbo = null;

//   gl.clearColor(0.1, 0.2, 0.3, 1.0);
//   gl.enable(gl.DEPTH_TEST);
//   gl.enable(gl.CULL_FACE);

//   var textureLoader = new WGLUTextureLoader(gl);
//   var texture = textureLoader.loadTexture("media/textures/cube-sea.png");
//   var cubeSea = new VRCubeSea(gl, texture);
//   var stereoUtil = new VRStereoUtil(gl);

//   var stats = new WGLUStats(gl);

//   var presentingMessage = document.getElementById("presenting-message");
//   var colorTexture;

//   // ================================
//   // WebVR-specific code begins here.
//   // ================================




//   frameData = new VRFrameData();

//   var displays = await navigator.getVRDisplays()
//   vrDisplay = displays[0];

//   // It's heighly reccommended that you set the near and far planes to
//   // something appropriate for your scene so the projection matricies
//   // WebVR produces have a well scaled depth buffer.
//   vrDisplay.depthNear = 0.1;
//   vrDisplay.depthFar = 1024.0;

//   // Generally, you want to wait until VR support is confirmed and
//   // you know the user has a VRDisplay capable of presenting connected
//   // before adding UI that advertises VR features.
//   document.onclick = async () => {
//     await vrDisplay.requestPresent([{ source: webglCanvas }])
//     // If we're presenting we want to use the drawing buffer size
//     // recommended by the VRDevice, since that will ensure the best
//     // results post-distortion.
//     leftEye = vrDisplay.getEyeParameters("left");
//     rightEye = vrDisplay.getEyeParameters("right");

//     // For simplicity we're going to render both eyes at the same size,
//     // even if one eye needs less resolution. You can render each eye at
//     // the exact size it needs, but you'll need to adjust the viewports to
//     // account for that.
//     let width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * ((is_multiview) ? 1 : 2);
//     let height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
//     console.log("onResize, presenting, multiview = " + is_multiview + ", new size = " + width + "x" + height);

//     if (ext) {
//       console.log("MaxViews = " + gl.getParameter(ext.MAX_VIEWS_OVR));
//       fbo = gl.createFramebuffer();
//       gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
//       colorTexture = gl.createTexture();
//       gl.bindTexture(gl.TEXTURE_2D_ARRAY, colorTexture);
//       gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, width, height, 2);
//       if (!is_multisampled)
//         ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, colorTexture, 0, 0, 2);
//       else
//         ext.framebufferTextureMultisampleMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, colorTexture, 0, samples, 0, 2);
//       console.log("Fbo attachment numviews = " + gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, ext.FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR));
//       console.log("Fbo base view index = " + gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, ext.FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR));

//       var depthStencilTex = gl.createTexture();
//       gl.bindTexture(gl.TEXTURE_2D_ARRAY, depthStencilTex);
//       gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.DEPTH_COMPONENT24, width, height, 2);
//       if (!is_multisampled)
//         ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, depthStencilTex, 0, 0, 2);
//       else
//         ext.framebufferTextureMultisampleMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, depthStencilTex, 0, samples, 0, 2);
//       console.log("Fbo attachment numviews = " + gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, ext.FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR));
//       console.log("Fbo base view index = " + gl.getFramebufferAttachmentParameter(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, ext.FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR));
//       //gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
//     }
//     webglCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
//     webglCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);

//     function onAnimationFrame(t) {
//       stats.begin();

//       gl.clearColor(0.1, 0.2, 0.3, 1.0);
//       gl.enable(gl.DEPTH_TEST);
//       gl.enable(gl.CULL_FACE);
//       // When presenting content to the VRDisplay we want to update at its
//       // refresh rate if it differs from the refresh rate of the main
//       // display. Calling VRDisplay.requestAnimationFrame ensures we render
//       // at the right speed for VR.
//       vrDisplay.requestAnimationFrame(onAnimationFrame);

//       // As a general rule you want to get the pose as late as possible
//       // and call VRDisplay.submitFrame as early as possible after
//       // retrieving the pose. Do any work for the frame that doesn't need
//       // to know the pose earlier to ensure the lowest latency possible.
//       //var pose = vrDisplay.getPose();
//       vrDisplay.getFrameData(frameData);

//       gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
//       gl.disable(gl.SCISSOR_TEST);
//       let projections = [frameData.leftProjectionMatrix, frameData.rightProjectionMatrix];
//       //getStandingViewMatrix(viewMat, frameData.leftViewMatrix);
//       //getStandingViewMatrix(viewMat2, frameData.rightViewMatrix);
//       let viewMats = [frameData.leftViewMatrix, frameData.rightViewMatrix];
//       let width = Math.max(leftEye.renderWidth, rightEye.renderWidth);
//       let height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
//       gl.viewport(0, 0, width, height);
//       //gl.scissor(0, 0, width, height);
//       //gl.clearColor(1.0, 0, 0, 1.0);
//       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
//       cubeSea.render(projections, viewMats, stats, /*multiview*/ true);
//       gl.invalidateFramebuffer(gl.FRAMEBUFFER, [gl.DEPTH_ATTACHMENT]);

//       gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, backFbo);

//       gl.disable(gl.SCISSOR_TEST);
//       gl.clearColor(0, 0, 0, 0);
//       gl.clear(gl.COLOR_BUFFER_BIT);

//       gl.viewport(0, 0, width * 2, height)
//       fullScreenQuadProg.load()
//       fullScreenQuadProg.updateUniforms({ debug: false });
//       twgl.setUniforms(fullScreenQuadProg.programInfo, { imgs: colorTexture });


//       gl.disable(gl.SCISSOR_TEST);
//       gl.disable(gl.DEPTH_TEST);
//       gl.disable(gl.STENCIL_TEST);
//       //    gl.disable(gl.CULL_FACE);
//       gl.colorMask(true, true, true, true);
//       gl.depthMask(false);
//       //    gl.disable(gl.BLEND);
//       //    gl.disable(gl.DITHER);


//       // Start setting up VAO  
//       fullScreenQuadProg.draw(quad)

//       gl.enable(gl.DEPTH_TEST);
//       gl.depthMask(true);





//       //stereoUtil.blit(true, colorTexture, 0, 0, 1, 1, width * 2, height);


//       // If we're currently presenting to the VRDisplay we need to
//       // explicitly indicate we're done rendering.
//       vrDisplay.submitFrame();


//       stats.end();
//     }
//     window.requestAnimationFrame(onAnimationFrame);
//   }






// })();