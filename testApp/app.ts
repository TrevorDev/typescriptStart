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


async function main() {
  // Initialize device and window
  var device = new GPUDevice()
  var xr = new XR(device);
  var renderWindow = new RenderWindow(device, true)
  var renderer = new Renderer(device)

  // Create lights and camera
  var light = new PointLight()
  light.position.z = 5;
  var camera = new XRCamera() 

  // Create material and geometry
  var videoTexture = new VideoTexture(device)
  var standardMaterial = new MaterialA(device)
  standardMaterial.diffuseTexture = videoTexture.texture//Texture.createForVideoTexture(device)
  // Texture.createFromeSource(device, [
  //   192, 192, 192, 255,
  //   192, 192, 192, 255,
  //   192, 192, 192, 255,
  //   192, 192, 192, 255,
  // ])
  var cubeVertexData = DefaultVertexData.createCubeVertexData(device)

  // Create meshes
  var meshes = new Array<Mesh>()
  for(var i =0;i<2;i++){
    var cube = new Mesh(cubeVertexData, standardMaterial)
    cube.scale.scaleInPlace(0.4)
    meshes.push(cube)
    cube.position.z -= 3+i
    cube.position.y = 0
    cube.scale.x = 1920/1080
    cube.scale.y = 1

  }

  // Custom blit operation
  var quad = DefaultVertexData.createFullScreenQuad(device)
  var fullScreenQuadProg = new CustomProgram(device, DefaultShaders.quadVertShader, DefaultShaders.blueFragShader)

  var time = (new Date()).getTime()
  var gameLoop = ()=>{
    var newTime = (new Date()).getTime()
    var deltaTime = (newTime - time)/1000;
    time = newTime;
    videoTexture.update()
    // if(videoElement.currentTime > 0){
    //   device.gl.bindTexture(device.gl.TEXTURE_2D, standardMaterial.diffuseTexture!.glTexture);
    //   device.gl.texImage2D(device.gl.TEXTURE_2D, 0, device.gl.RGBA,
    //   device.gl.RGBA, device.gl.UNSIGNED_BYTE, videoElement)
    // }
    

    // Update meshes
    meshes[0].position.y+=0.2*deltaTime

    // Clear and set viewport
    if(xr.state != XRState.IN_XR){
      renderWindow.updateDimensions()
    }
    
    
    // Render next action to to multiview texture
    renderer.setRenderMultiviewTexture(xr.multiviewTexture)
    
    // Setup viewport and clear
    renderer.setViewport(0, 0, xr.multiviewTexture.width, xr.multiviewTexture.height)
    device.gl.clearColor(0.2,0.4,0.4,1)
    renderer.clear()

    // Update camera

    if(xr.state == XRState.IN_XR && xr.display.getFrameData(xr.frameData)){
      camera.updateFromFrameData(xr.frameData)
    }

    // Render scene
    renderer.renderScene(camera, meshes, [light])

    // Blit back to screen
    if(xr.state == XRState.IN_XR){
      renderer.setRenderTexture(xr.getNextTexture())
    }else{
      renderer.setRenderTexture(renderWindow.getNextTexture())
    }

    // When presenting render a stereo view.
    renderer.setViewport(0, 0, device.canvasElement.width, device.canvasElement.height)
    device.gl.clearColor(1.0,0.4,0.4,1)
    renderer.clear()

    fullScreenQuadProg.load()
    fullScreenQuadProg.setTextures({imgs: xr.multiviewTexture})
    fullScreenQuadProg.draw(quad)

    if(xr.state == XRState.IN_XR){
      xr.display.submitFrame();
    }
  }


  var currentLoop = new Loop(requestAnimationFrame, gameLoop)
  document.onclick = async ()=>{
    await currentLoop.stop()
    console.log("TRYING")
    if(await xr.canStart()){
      console.log("STARTING")
      await xr.start()
      xr.display.depthNear = 0.1;
      xr.display.depthFar = 1024.0;
      currentLoop = new Loop((x:any)=>{xr.display.requestAnimationFrame(x)}, gameLoop)
    }
  }
}
main();