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
import { SceneRenderer } from "./sceneGraph/renderer";

function main() {
  // Initialize device and window
  var device = new GPUDevice()
  var renderWindow = new RenderWindow(device)
  var renderer = new SceneRenderer(device)

  // Create material
  var standardMaterial = new StandardMaterial(device)
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
  camera.worldMatrix.compose(camera.position)

  // Create mesh
  var cubeVertexData = DefaultVertexData.createCubeVertexData(device)
  var cube = new Mesh(cubeVertexData, standardMaterial)

  
  renderWindow.onScreenRefreshLoop(() => {
    // Clear and set viewport
    renderWindow.updateDimensions()
    renderer.setTexture(renderWindow.getNextTexture())
    renderer.setViewport(0, 0, renderWindow.dimensions.x, renderWindow.dimensions.y)
    renderer.clear()

    // Update camera
    camera.projection.setProjection(30 * Math.PI / 180, renderWindow.dimensions.x/renderWindow.dimensions.y, 0.5, 250)
    camera.update()
    
    // Load material program
    standardMaterial.load()
    standardMaterial.updateFromCamera(camera)
    standardMaterial.updateForLights([light])
    
    // Load material instance specific data
    standardMaterial.updateUniforms()
    standardMaterial.updateAndDrawForMesh(cube)

    renderer.render(camera, [cube], [light])
  })
}
main();