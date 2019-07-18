import { NiftyOS } from "../niftyOS";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import THREE = require("three");
import { WebRTCPeer } from "../../../screenCapture/WebRTCPeer";

declare var io: any;
var socket: SocketIO.Socket = io();
var main = async()=>{
    var os = NiftyOS.GetOS()
    var input = os.getInputManager()
    var app = os.createApp()

    // Create video element
    var localVideo = document.createElement('video');
    localVideo.width = 800;
    localVideo.autoplay = true
    localVideo.muted = true
    document.body.appendChild(localVideo)

    // Setup screen
    var screenGeom = new THREE.PlaneGeometry( 1920/1080, 1 );
    var videoTexture = new THREE.VideoTexture(localVideo)
    var screenMat = new THREE.MeshLambertMaterial( {map: videoTexture} );
    var screen = new THREE.Mesh( screenGeom, screenMat );
    screen.scale.setScalar(2)
    screen.position.y = 1
    app.scene.add(screen)

    // Connect to desktop streaming peer
    var peer = new WebRTCPeer(socket)
    peer.setVideoElement(localVideo)
    peer.makeCall()

    // On trigger move/click desktop mouse
    input.controllers.forEach((c)=>{
        c.primaryButton.onDown.add(()=>{
            var hit = c.raycaster.intersectObject(screen)

            if(hit[0] && hit[0].uv){
                console.log(hit[0].uv)
                socket.emit("robot", {action: "mouseMove", x: hit[0].uv.x, y: 1-hit[0].uv.y})
                socket.emit("robot", {action: "mouseDown"})

                c.primaryButton.onUp.addOnce(()=>{
                    var hit = c.raycaster.intersectObject(screen)
                    if(hit[0] && hit[0].uv){
                        socket.emit("robot", {action: "mouseMove", x: hit[0].uv.x, y: 1-hit[0].uv.y})
                    }
                    socket.emit("robot", {action: "mouseUp"})
                })
                
            }
        })
    })
}
main()