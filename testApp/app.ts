import * as twgl from "twgl.js"
import { RenderWindow } from "./cmdBuffer/io/renderWindow";
import { Shader } from "./cmdBuffer/engine/shader";
import { DefaultShaders } from "./defaultHelpers/defaultShaders";
import { GPUDevice } from "./cmdBuffer/engine/gpuDevice";
import { GPUBuffer } from "./cmdBuffer/cmdBuffer";
import { RenderPipelineState, RenderPipelineDescriptor } from "./cmdBuffer/engine/renderPipeline";
import { CommandQueue } from "./cmdBuffer/engine/commandQueue";
import { RenderPassDesc } from "./cmdBuffer/engine/renderPass";
import { Texture } from "./cmdBuffer/engine/texture";
import { Scene } from "./sceneGraph/scene";
import { VertexData } from "./sceneGraph/vertexData";
import { StandardMaterial } from "./sceneGraph/standardMaterial";
import { Mesh } from "./sceneGraph/mesh";
import { DefaultVertexData } from "./defaultHelpers/defaultVertexData";
import { Camera } from "./sceneGraph/camera";
import { PointLight } from "./sceneGraph/pointLight";
import { Renderer } from "./sceneGraph/renderer";
import { MultiviewTexture } from "./sceneGraph/multiviewTexture";
import { MaterialA } from "./sceneGraph/materialA";
import { CustomProgram } from "./sceneGraph/customProgram";
import { XR, XRState } from "./xr/xr";
import { Loop } from "./sceneGraph/loop";


async function main() {
  var isOcculusBrowser = navigator.userAgent.indexOf("OculusBrowser") > 0

  // Initialize device and window
  var device = new GPUDevice()
  var xr = new XR(device);
  var renderWindow = new RenderWindow(device)
  var renderer = new Renderer(device)

  // Create material
  var standardMaterial = new MaterialA(device) // new StandardMaterial(device)
  standardMaterial.diffuseTexture = Texture.createFromeSource(device, [
    255, 255, 255, 255,
    192, 192, 192, 255,
    192, 192, 192, 255,
    255, 255, 255, 255,
  ])

  // Create light
  var light = new PointLight()
  light.position.z = 5;

  // Create camera
  var camera = new Camera()
  camera.position.z = 5;

  var meshes = new Array<Mesh>()

  // Create mesh
  for(var i =0;i<2;i++){
    var cubeVertexData = DefaultVertexData.createCubeVertexData(device)
    var cube = new Mesh(cubeVertexData, standardMaterial)
    cube.scale.scaleInPlace(0.4)
    meshes.push(cube)
    cube.position.z -= 1+i
    cube.position.y = 1
  }

  // Custom blit operation
  var quad = DefaultVertexData.createFullScreenQuad(device)
  var fullScreenQuadProg = new CustomProgram(device)

  var gameLoop = ()=>{
    meshes[0].position.y+=0.001
    // Clear and set viewport
    renderWindow.updateDimensions()
    
    // Render next action to to multiview texture
    renderer.setRenderMultiviewTexture(xr.multiviewTexture)

    // TODO use multiview viewport instead
    // Setup viewport and clear
    renderer.setViewport(0, 0, xr.multiviewTexture.width, xr.multiviewTexture.height)
    device.gl.clearColor(0.2,0.4,0.4,1)
    renderer.clear()

    // Update camera
    //camera.projection.setProjection(30 * Math.PI / 180, renderWindow.dimensions.x/renderWindow.dimensions.y, 0.5, 250)

    if(xr.state == XRState.IN_XR && xr.display.getFrameData(xr.frameData)){
      
      
      //if(xr.display.isPresenting){
        camera.projection.copyFromArrayBufferView(xr.frameData.leftProjectionMatrix)
        camera.projectionR.copyFromArrayBufferView(xr.frameData.rightProjectionMatrix)

        camera.view.copyFromArrayBufferView(xr.frameData.leftViewMatrix)
        camera.viewR.copyFromArrayBufferView(xr.frameData.rightViewMatrix)
        // console.log("UPDATE CAM")
        // debugger
      //}
    }
    camera.frameData = xr.frameData

    // Render scene
    renderer.renderScene(camera, meshes, [light])

    if(xr.state == XRState.IN_XR){
      // TODO FIX THIS
      renderer.setRenderTexture(renderWindow.getNextTexture())

      // When presenting render a stereo view.
      device.gl.clearColor(0.4,0.2,0.2,1.0)
      device.gl.viewport(0, 0, device.canvasElement.width, device.canvasElement.height);
      device.gl.enable(device.gl.DEPTH_TEST);
      device.gl.enable(device.gl.CULL_FACE);
      device.gl.clear(device.gl.COLOR_BUFFER_BIT | device.gl.DEPTH_BUFFER_BIT);

      fullScreenQuadProg.load()
      fullScreenQuadProg.setTextures({imgs: xr.multiviewTexture})
      fullScreenQuadProg.draw(quad)

      xr.display.submitFrame();
    }else{
      // Blit back to screen
      renderer.setRenderTexture(renderWindow.getNextTexture())

      renderer.setViewport(0, 0, renderWindow.dimensions.x, renderWindow.dimensions.y)
      device.gl.clearColor(1.0,0.4,0.4,1)
      renderer.clear()

      // Figure out how to move this to renderer
      // Render each eye to the screen
      fullScreenQuadProg.load()
      fullScreenQuadProg.setTextures({imgs: xr.multiviewTexture})
      fullScreenQuadProg.draw(quad)
    }
  }


  var currentLoop = new Loop(requestAnimationFrame, gameLoop)
  document.onclick = async ()=>{
    
  
 // document.addEventListener("pointerdown", async ()=>{
    await currentLoop.stop()
    console.log("TRYING")
    if(await xr.canStart()){
      console.log("STARTING")
      await xr.start()
      xr.display.depthNear = 0.1;
      xr.display.depthFar = 1024.0;
     // currentLoop = new Loop(xr.display.requestAnimationFrame, gameLoop)
     var loop = ()=>{
      xr.display.requestAnimationFrame(loop)
       gameLoop()
     }
     xr.display.requestAnimationFrame(loop)
      console.log("new loop")
    }
 // });
}
}
main();