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
import { StandardMaterialFactory, StandardMaterial } from "./sceneGraph/standardMaterial";
import { Mesh } from "./sceneGraph/mesh";
import { DefaultVertexData } from "./defaultHelpers/defaultVertexData";

var device = new GPUDevice()
var renderWindow = new RenderWindow(device)
var scene = new Scene()


var cubeVertexData = DefaultVertexData.createCubeVertexData(device)

// Checkerboard texture
const tex = Texture.createFromeSource(device, [
  255, 255, 255, 255,
  192, 192, 192, 255,
  192, 192, 192, 255,
  255, 255, 255, 255,
])

// var programInfo = twgl.createProgramInfo(device.gl, [DefaultShaders.vertShader.str, DefaultShaders.fragShader.str])
// const viewUboInfo = twgl.createUniformBlockInfo(device.gl, programInfo, "View");
// console.log(viewUboInfo.uniforms)

var standardMaterial = new StandardMaterial()

var cube = new Mesh(cubeVertexData, standardMaterial)
scene.add(cube)

renderWindow.onScreenRefreshLoop(() => {
  console.log("render")
  scene.render()
})

//var ob:twgl.m4.Mat4 = twgl.m4.identity()


// var vertexData = {
//   position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
//   normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
//   texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
//   indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
// };
// var vertBuffer = new GPUBuffer(device, vertexData)

// var pipelineDesc = new RenderPipelineDescriptor()
// pipelineDesc.fragmentFunction = DefaultShaders.fragShader
// pipelineDesc.vertexFunction = DefaultShaders.vertShader
// var pipelineState = new RenderPipelineState(device, pipelineDesc)

// var commandQueue = new CommandQueue(device)
// var renderPassDesc = new RenderPassDesc()

// const tex = Texture.createFromeSource(device, [
//   255, 255, 255, 255,
//   192, 192, 192, 255,
//   192, 192, 192, 255,
//   255, 255, 255, 255,
// ])

// const uniforms = {
//   u_lightWorldPos: [1, 8, -10],
//   u_lightColor: [1, 0.8, 0.8, 1],
//   u_ambient: [0, 0, 0, 1],
//   u_specular: [1, 1, 1, 1],
//   u_shininess: 50,
//   u_specularFactor: 1,
//   u_diffuse: tex.glTexture,
//   u_viewInverse: null as any,
//   u_world: null as any,
//   u_worldInverseTranspose: null as any,
//   u_worldViewProjection: null as any,
// };

// var lastTime = new Date().getTime()
// var time = new Date().getTime()
// var deltaTime = 0;
// renderWindow.onScreenRefreshLoop(() => {
//   //console.log("frame")
//   lastTime = time
//   time = new Date().getTime()
//   deltaTime = (time-lastTime)/1000

//   const fov = 30 * Math.PI / 180;
//   const aspect = renderWindow.dimensions.x / renderWindow.dimensions.y;
//   const zNear = 0.5;
//   const zFar = 10;
//   const projection = twgl.m4.perspective(fov, aspect, zNear, zFar);
//   const eye = [1, 4, -6];
//   const target = [0, 0, 0];
//   const up = [0, 1, 0];

//   const camera = twgl.m4.lookAt(eye, target, up);
//   const view = twgl.m4.inverse(camera);
//   const viewProjection = twgl.m4.multiply(projection, view);
//   const world = twgl.m4.rotationY(time/1000);

//   uniforms.u_viewInverse = camera;
//   uniforms.u_world = world;
//   uniforms.u_worldInverseTranspose = twgl.m4.transpose(twgl.m4.inverse(world));
//   uniforms.u_worldViewProjection = twgl.m4.multiply(viewProjection, world);








//   var toDraw = renderWindow.getNextTexture()
//   renderPassDesc.colorAttachments[0].texture = toDraw
//   renderPassDesc.colorAttachments[0].clearColor.r = 0.2
//   renderPassDesc.colorAttachments[0].clearColor.g = 0

//   var commandBuffer = commandQueue.makeCommandBuffer()

//   let renderEncoder = commandBuffer.makeRenderCommandEncoder(renderPassDesc)



//   renderEncoder.setRenderPipelineState(pipelineState)
//   renderEncoder.setVertexBuffer(vertBuffer)
//   renderEncoder.setUniforms(uniforms)
//   renderEncoder.drawPrimitives("triangle", 0, vertexData.indices.length, 1)
//   renderEncoder.endEncoding()

//   commandBuffer.present(toDraw)
//   commandBuffer.commit()



// })