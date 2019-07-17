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
    //localVideo.height = 600;
    localVideo.autoplay = true
    document.body.appendChild(localVideo)

    var screenGeom = new THREE.PlaneGeometry( 1920/1080, 1 );
    
    var screenMat = new THREE.MeshLambertMaterial(  );
    var screen = new THREE.Mesh( screenGeom, screenMat );
    screen.position.y = 1.3
    app.scene.add(screen)

    var peer = new WebRTCPeer(socket)
    peer.createConnection()
    // Create desktop stream
    var tracks:Array<MediaStreamTrack> = []
    peer.connection.ontrack = (event) => {
        console.log(event.track.kind)
        tracks.push(event.track)
        localVideo.srcObject = new MediaStream(tracks);
        
        var videoTexture = new THREE.VideoTexture(localVideo)
        var screenMat = new THREE.MeshLambertMaterial( {map: videoTexture} );
        localVideo.onplaying = ()=>{
            console.log("JFKLKSDJFKLJSDKFOJ")
        }
        localVideo.autoplay = true
        screen.material = screenMat
    }
    //peer.setVideoElement(localVideo)
    peer.makeCall()

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