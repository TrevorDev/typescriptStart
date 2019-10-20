import express from "express"
import * as http from "http"
import sio from "socket.io";
import program from "commander"
import { WebRtcPeer } from "./libs/webRTCPeer"
//@ts-ignore
// import * as nrtc from "wrtc"
// import { EventEmitter } from "events";
const RTCPeerConnection = require('wrtc').RTCPeerConnection;

const { createCanvas, createImageData } = require('canvas');
// const { hsv } = require('color-space');
// const { performance } = require('perf_hooks');

const { RTCVideoSink, RTCVideoSource, i420ToRgba, rgbaToI420 } = require('wrtc').nonstandard;

const width = 640;
const height = 480;
//console.log(nrtc)

program
  .version('0.1.0')
  .option('-p, --port [port]', 'port to run on')
  .parse(process.argv)

var port = program.port ? program.port : 3000
console.log("Starting on port: " + port)

// Basic express webserver
var app = express()
app.use(express.json());
app.use("/public", express.static("public"))
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html")
})

var connection: WebRtcPeer
app.get('/connections', async function (req, res) {
  connection = new WebRtcPeer();
  var peerConnection = connection.peerConnection

  const source = new RTCVideoSource();
  const track = source.createTrack();
  const transceiver = peerConnection.addTransceiver(track);
  const sink = new RTCVideoSink(transceiver.receiver.track);

  let lastFrame: any = null;

  function onFrame(x: any) {
    lastFrame = x.frame;
  }

  sink.addEventListener('frame', onFrame);

  // TODO(mroberts): Is pixelFormat really necessary?
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d', { pixelFormat: 'RGBA24' });
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  let hue = 0;

  const interval = setInterval(() => {
    if (lastFrame) {
      const lastFrameCanvas = createCanvas(lastFrame.width, lastFrame.height);
      const lastFrameContext = lastFrameCanvas.getContext('2d', { pixelFormat: 'RGBA24' });

      const rgba = new Uint8ClampedArray(lastFrame.width * lastFrame.height * 4);
      const rgbaFrame = createImageData(rgba, lastFrame.width, lastFrame.height);
      i420ToRgba(lastFrame, rgbaFrame);

      lastFrameContext.putImageData(rgbaFrame, 0, 0);
      context.drawImage(lastFrameCanvas, 0, 0);
    } else {
      context.fillStyle = 'rgba(255, 255, 255, 0.025)';
      context.fillRect(0, 0, width, height);
    }

    hue = ++hue % 360;
    const [r, g, b] = [255, 0, 0];
    //const thisTime = performance.now();

    context.font = '60px Sans-serif';
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 1)`;
    context.textAlign = 'center';
    context.save();
    context.translate(width / 2, height / 2);
    //context.rotate(thisTime / 1000);
    context.strokeText('node-webrtc', 0, 0);
    context.fillText('node-webrtc', 0, 0);
    context.restore();

    const rgbaFrame = context.getImageData(0, 0, width, height);
    const i420Frame = {
      width,
      height,
      data: new Uint8ClampedArray(1.5 * width * height)
    };
    rgbaToI420(rgbaFrame, i420Frame);
    source.onFrame(i420Frame);
    // console.log("onframe")
  });

  // NOTE(mroberts): This is a hack so that we can get a callback when the
  // RTCPeerConnection is closed. In the future, we can subscribe to
  // "connectionstatechange" events.
  const { close } = peerConnection;
  peerConnection.close = function () {
    clearInterval(interval);
    sink.stop();
    track.stop();
    return close.apply(this, arguments);
  };


  console.log("Creating offer")
  await connection.doOffer()
  console.log("offer done")


  // const offer = await peerConnection.createOffer();
  // await peerConnection.setLocalDescription(offer);
  // try {
  //   //await waitUntilIceGatheringStateComplete(peerConnection, options);
  // } catch (error) {
  //   //this.close();
  //   throw error;
  // }


  res.send(connection)

})

app.post(`/connections/:id/remote-description`, async (req, res) => {
  // console.log("GOT POST")
  // console.log(req.body)
  const { id } = req.params;
  if (!connection) {
    res.sendStatus(404);
    return;
  }
  try {
    await connection.applyAnswer(req.body);
    res.send(connection.toJSON().remoteDescription);
  } catch (error) {
    res.sendStatus(400);
  }
});

var server = http.createServer(app)
server.listen(port)

