import * as twgl from "twgl.js"
import { RenderWindow } from "./cmdBuffer/io/renderWindow";
import { Shader } from "./cmdBuffer/engine/shader";
import { DefaultShaders } from "./defaultHelpers/defaultShaders";
import { GPUDevice } from "./cmdBuffer/engine/gpuDevice";
import { GPUBuffer } from "./cmdBuffer/cmdBuffer";
import { RenderPipelineState, RenderPipelineDescriptor } from "./cmdBuffer/engine/renderPipeline";
import { CommandQueue } from "./cmdBuffer/engine/commandQueue";
import { RenderPassDesc } from "./cmdBuffer/engine/renderPass";

var device = new GPUDevice()
var rw = new RenderWindow(device)



var vertexData = {
  position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
  normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
  texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
};

var vertBuffer = new GPUBuffer(device, vertexData)

var vs = DefaultShaders.vertShader
var fs = DefaultShaders.fragShader

var pipelineDesc = new RenderPipelineDescriptor()
pipelineDesc.fragmentFunction = fs
pipelineDesc.vertexFunction = vs

var pipelineState = new RenderPipelineState(device, pipelineDesc)

var commandQueue = new CommandQueue(device)



var renderPassDesc = new RenderPassDesc()



  const tex = twgl.createTexture(device.gl, {
    min: device.gl.NEAREST,
    mag: device.gl.NEAREST,
    src: [
      255, 255, 255, 255,
      192, 192, 192, 255,
      192, 192, 192, 255,
      255, 255, 255, 255,
    ],
  });

  const uniforms = {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 0.8, 0.8, 1],
    u_ambient: [0, 0, 0, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 50,
    u_specularFactor: 1,
    u_diffuse: tex,
    u_viewInverse: null as any,
    u_world: null as any,
    u_worldInverseTranspose: null as any,
    u_worldViewProjection: null as any,
  };

var time = 0
rw.onScreenRefreshLoop(()=>{
  console.log("frame")
  time += 0.01;

  const fov = 30 * Math.PI / 180;
  const aspect = device.gl.canvas.clientWidth / device.gl.canvas.clientHeight;
  const zNear = 0.5;
  const zFar = 10;
  const projection = twgl.m4.perspective(fov, aspect, zNear, zFar);
  const eye = [1, 4, -6];
  const target = [0, 0, 0];
  const up = [0, 1, 0];

  const camera = twgl.m4.lookAt(eye, target, up);
  const view = twgl.m4.inverse(camera);
  const viewProjection = twgl.m4.multiply(projection, view);
  const world = twgl.m4.rotationY(time);

  uniforms.u_viewInverse = camera;
  uniforms.u_world = world;
  uniforms.u_worldInverseTranspose = twgl.m4.transpose(twgl.m4.inverse(world));
  uniforms.u_worldViewProjection = twgl.m4.multiply(viewProjection, world);








  var toDraw = rw.getNextTexture()
  renderPassDesc.colorAttachments[0].texture = toDraw
  renderPassDesc.colorAttachments[0].clearColor.r = 0.2
  renderPassDesc.colorAttachments[0].clearColor.g = 0

  var commandBuffer = commandQueue.makeCommandBuffer()
  
  let renderEncoder = commandBuffer.makeRenderCommandEncoder(renderPassDesc)

  // TODO MOVE THESE TO BELOW AND MAKE RENDER ENCODER WRITE TO COMMAND BUFFER
  commandBuffer.present(toDraw)
  commandBuffer.commit()

  renderEncoder.setRenderPipelineState(pipelineState)
  renderEncoder.setVertexBuffer(vertBuffer)
  renderEncoder.setUniforms(uniforms)
  renderEncoder.drawPrimitives("triangle", 0, vertexData.indices.length, 1)
  renderEncoder.endEncoding()

  

})



// var el = document.createElement("canvas")
// document.body.appendChild(el)

// const gl = el.getContext("webgl")!;
//   const programInfo = twgl.createProgramInfo(gl, [`

  
    
  
//   `, `
  

  
    
  
//   `]);
 

//   "use strict";
//   const m4 = twgl.m4;


//   const arrays = {
//     position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
//     normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
//     texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
//     indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
//   };
//   const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

//   const tex = twgl.createTexture(gl, {
//     min: gl.NEAREST,
//     mag: gl.NEAREST,
//     src: [
//       255, 255, 255, 255,
//       192, 192, 192, 255,
//       192, 192, 192, 255,
//       255, 255, 255, 255,
//     ],
//   });

//   const uniforms = {
//     u_lightWorldPos: [1, 8, -10],
//     u_lightColor: [1, 0.8, 0.8, 1],
//     u_ambient: [0, 0, 0, 1],
//     u_specular: [1, 1, 1, 1],
//     u_shininess: 50,
//     u_specularFactor: 1,
//     u_diffuse: tex,
//     u_viewInverse: null as any,
//     u_world: null as any,
//     u_worldInverseTranspose: null as any,
//     u_worldViewProjection: null as any,
//   };

//   function render(time:number) {
//     time *= 0.001;
//     twgl.resizeCanvasToDisplaySize(gl.canvas);
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

//     gl.enable(gl.DEPTH_TEST);
//     gl.enable(gl.CULL_FACE);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     const fov = 30 * Math.PI / 180;
//     const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
//     const zNear = 0.5;
//     const zFar = 10;
//     const projection = m4.perspective(fov, aspect, zNear, zFar);
//     const eye = [1, 4, -6];
//     const target = [0, 0, 0];
//     const up = [0, 1, 0];

//     const camera = m4.lookAt(eye, target, up);
//     const view = m4.inverse(camera);
//     const viewProjection = m4.multiply(projection, view);
//     const world = m4.rotationY(time);

//     uniforms.u_viewInverse = camera;
//     uniforms.u_world = world;
//     uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
//     uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

//     gl.useProgram(programInfo.program);
//     twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
//     twgl.setUniforms(programInfo, uniforms);
//     gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

//     requestAnimationFrame(render);
//   }
//   requestAnimationFrame(render);

