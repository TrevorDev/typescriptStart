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
  var renderer = new SceneRenderer()

  // TODO REMOVE
  const m4 = twgl.m4;
  twgl.setDefaults({ attribPrefix: "a_" });

  // Create mesh
  var cubeVertexData = DefaultVertexData.createCubeVertexData(device)
  var standardMaterial = new StandardMaterial(device)
  var cube = new Mesh(cubeVertexData, standardMaterial)

  // Create light
  var light = new PointLight()

  // Create camera
  var camera = new Camera()
  camera.position.z = 5;
  camera.worldMatrix.compose(camera.position)

  // Create texture
  const tex = Texture.createFromeSource(device, [
    255, 255, 255, 255,
    192, 192, 192, 255,
    192, 192, 192, 255,
    255, 255, 255, 255,
  ])
  const uniforms = {
    u_diffuse: tex.glTexture,
  };

  // const lightUboInfos = [];
  // const lightUbo = twgl.createUniformBlockInfo(device.gl, standardMaterial.programInfo, "Lights[0]");
  // twgl.setBlockUniforms(lightUbo, {
  //   u_lightColor: [0.5, 0.2, 0.2, 1],
  //   u_lightWorldPos: [0, 0, 5],
  // });
  // twgl.setUniformBlock(device.gl, standardMaterial.programInfo, lightUbo);
  // lightUboInfos.push(lightUbo);


  const materialUbo = twgl.createUniformBlockInfo(device.gl, standardMaterial.programInfo, "Material");
  twgl.setBlockUniforms(materialUbo, {
    u_ambient: [0, 0, 0, 1],
    u_specular: [0.5, 0.2, 0.2, 1],
    u_shininess: 100,
    u_specularFactor: 0.8,
  });
  twgl.setUniformBlock(device.gl, standardMaterial.programInfo, materialUbo);

  const modelUbo = twgl.createUniformBlockInfo(device.gl, standardMaterial.programInfo, "Model");
  const world = m4.identity();
  twgl.setBlockUniforms(modelUbo, {
    u_world: world,
    u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
  });
  twgl.setUniformBlock(device.gl, standardMaterial.programInfo, modelUbo);
  

  function render() {
    renderWindow.updateDimensions()
    device.gl.viewport(0, 0, renderWindow.dimensions.x, renderWindow.dimensions.y);
    device.gl.enable(device.gl.DEPTH_TEST);
    device.gl.enable(device.gl.CULL_FACE);
    device.gl.clear(device.gl.COLOR_BUFFER_BIT | device.gl.DEPTH_BUFFER_BIT);

    // Update camera
    camera.projection.setProjection(30 * Math.PI / 180, renderWindow.dimensions.x/renderWindow.dimensions.y, 0.5, 250)
    camera.update()
    
    // Load material program
    standardMaterial.load()
    standardMaterial.updateFromCamera(camera)
    
    // Set lights in material program
    // twgl.bindUniformBlock(device.gl, standardMaterial.programInfo, o.lightUboInfo);

    // Render object
    twgl.setUniforms(standardMaterial.programInfo, uniforms); // Set mat textures
    twgl.setBuffersAndAttributes(device.gl, standardMaterial.programInfo, cube.vertData.gpuBufferInfo); // Set object vert data
    twgl.bindUniformBlock(device.gl, standardMaterial.programInfo, materialUbo); // material info
    twgl.bindUniformBlock(device.gl, standardMaterial.programInfo, modelUbo);  // model position
    twgl.drawBufferInfo(device.gl, cube.vertData.gpuBufferInfo);

    renderer.render(camera, [cube])

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
main();





// var device = new GPUDevice()
// var renderWindow = new RenderWindow(device)
// var scene = new Scene()


// var cubeVertexData = DefaultVertexData.createCubeVertexData(device)

// // Checkerboard texture
// const tex = Texture.createFromeSource(device, [
//   255, 255, 255, 255,
//   192, 192, 192, 255,
//   192, 192, 192, 255,
//   255, 255, 255, 255,
// ])

// const uniforms = {
//   u_diffuse: tex,
// };


// var standardMaterial = new StandardMaterial(device)

// var cube = new Mesh(cubeVertexData, standardMaterial)
// scene.add(cube)

// var camera = new Camera()
// camera.position.z = -5;
// camera.worldMatrix.compose(camera.position)
// //camera.projectionMatrix 

// device.gl.clearColor(0.1,0.2,0.4,1)
// renderWindow.onScreenRefreshLoop(() => {
//   console.log("render")
//   scene.render()


//   device.gl.viewport(0, 0, device.gl.canvas.width, device.gl.canvas.height);

//   device.gl.enable(device.gl.DEPTH_TEST);
//   device.gl.enable(device.gl.CULL_FACE);
//   device.gl.clear(device.gl.COLOR_BUFFER_BIT | device.gl.DEPTH_BUFFER_BIT);


//   camera.projection.setProjection(30 * Math.PI / 180, device.gl.canvas.clientWidth / device.gl.canvas.clientHeight, 0.5, 250)
//   camera.update()

//   // console.log("camera projection")
//   // console.log(camera.projection.m)

//   // console.log("camera position")
//   // console.log(camera.worldMatrix.m)

//   // console.log("camera view")
//   // console.log(camera.view.m)
//   // debugger
//   // const projection = m4.perspective(30 * Math.PI / 180, device.gl.canvas.clientWidth / device.gl.canvas.clientHeight, 0.5, 250);
//   // const radius = 70;
//   // const eye = [Math.sin(time) * radius, Math.sin(time * 0.3) * radius * 0.6, Math.cos(time) * radius];
//   // const target = [0, 0, 0];
//   // const up = [0, 1, 0];


//   //const camera = m4.lookAt(eye, target, up, viewInverse);
//   // const view = m4.inverse(camera);
//   // m4.multiply(projection, view, viewProjection);


//   device.gl.useProgram(standardMaterial.programInfo.program);
//   twgl.setBuffersAndAttributes(device.gl, standardMaterial.programInfo, cube.vertData.gpuBufferInfo);
//   twgl.setUniforms(standardMaterial.programInfo, uniforms);


//   twgl.m4.copy(camera.projection.m, standardMaterial.viewUboInfo.uniforms.u_viewProjection as Float32Array)
//   twgl.m4.copy(camera.worldMatrix.m, standardMaterial.viewUboInfo.uniforms.u_viewInverse as Float32Array)


//   twgl.setUniformBlock(device.gl, standardMaterial.programInfo, standardMaterial.viewUboInfo);

//   //objects.forEach(function(o) {
//     // twgl.bindUniformBlock(device.gl, standardMaterial.programInfo, /*o.*/ standardMaterial.lightUboInfo);
//     // twgl.bindUniformBlock(device.gl, standardMaterial.programInfo, /*o.*/ standardMaterial.materialUboInfo);
//     twgl.bindUniformBlock(device.gl, standardMaterial.programInfo, /*o.*/ standardMaterial.modelUboInfo);

//     twgl.drawBufferInfo(device.gl, cube.vertData.gpuBufferInfo);
//  // });
// })
