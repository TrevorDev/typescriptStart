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

function main() {
  // Initialize device and window
  var device = new GPUDevice()
  var renderWindow = new RenderWindow(device)
  var renderer = new Renderer(device)

  var multiviewTexture = new MultiviewTexture(device, 1920/2, 1080)

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

  for(var i =0;i<20;i++){
     // Create mesh
    var cubeVertexData = DefaultVertexData.createCubeVertexData(device)
    var cube = new Mesh(cubeVertexData, standardMaterial)
    cube.scale.scaleInPlace(0.4)
    meshes.push(cube)
    cube.position.z -= i
    cube.position.y = -1
  }
 

  var quad = DefaultVertexData.createFullScreenQuad(device)
  var fullScreenQuadProg = new CustomProgram(device)

  


  // var cube2 = new Mesh(cubeVertexData, standardMaterial)
  // cube2.position.y+=2
  // cube.addChild(cube2)

  // document.onkeydown = ()=>{
  //   cube.position.x+= 0.1
  // }
  
  renderWindow.onScreenRefreshLoop(() => {
    // Clear and set viewport
    renderWindow.updateDimensions()
    
    // Render next action to to multiview texture
    renderer.setRenderMultiviewTexture(multiviewTexture)

    // TODO use multiview viewport instead
    // Setup viewport and clear
    renderer.setViewport(0, 0, multiviewTexture.width, multiviewTexture.height)
    device.gl.clearColor(0.2,0.4,0.4,1)
    renderer.clear()

    // Update camera
    camera.projection.setProjection(30 * Math.PI / 180, renderWindow.dimensions.x/renderWindow.dimensions.y, 0.5, 250)

    // Render scene
    renderer.renderScene(camera, meshes, [light])

    // Blit back to screen
    renderer.setRenderTexture(renderWindow.getNextTexture())

    renderer.setViewport(0, 0, renderWindow.dimensions.x, renderWindow.dimensions.y)
    device.gl.clearColor(1.0,0.4,0.4,1)
    renderer.clear()

    // Figure out how to move this to renderer
    // Render each eye to the screen
    fullScreenQuadProg.load()
    fullScreenQuadProg.setTextures({imgs: multiviewTexture})
    fullScreenQuadProg.draw(quad)
    
  })
}
main();