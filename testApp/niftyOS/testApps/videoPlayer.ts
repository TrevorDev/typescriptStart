import { NiftyOS } from "../niftyOS";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import THREE = require("three");
import { Nullable } from "../types/common";

var main = async()=>{
    var os = NiftyOS.GetOS()
    var input = os.getInputManager()
    var app = os.createApp()

    // Create video element
    var localVideo = document.createElement('video');
    localVideo.width = 800;
    localVideo.autoplay = true
    //localVideo.muted = true
    localVideo.loop = true
    localVideo.src = "/public/video/output.mp4"
    //localVideo.play();
    document.body.appendChild(localVideo)

    var screen:Nullable<THREE.Mesh> = null;

    // Connect to desktop streaming peer
    //var peer = new WebRTCPeer(socket)
   // peer.trackAdded.add(()=>{
       // if(!screen){
            // Setup screen
            var screenGeom = new THREE.PlaneGeometry( 1920/1080, 1 );
            var videoTexture = new THREE.VideoTexture(localVideo);

            var refresh = ()=>{
                var video = (videoTexture as any).image;

                if (video.readyState >= video.HAVE_CURRENT_DATA ) {

                    (videoTexture as any).needsUpdate = true;

                }
                setTimeout(refresh, 1000/30);
            }
            refresh();
           
            (videoTexture as any).update = ()=>{
               
            } 
            var screenMat = new THREE.MeshBasicMaterial( {map: videoTexture} );
            screen = new THREE.Mesh( screenGeom, screenMat );
            screen.scale.setScalar(2)
            screen.position.y = 1
            app.scene.add(screen)
    // document.onkeydown = ()=>{
    //     localVideo.play();
    //     localVideo.muted = false
    // }
           
      //  }
    // })
    // peer.setVideoElement(localVideo)
    // peer.makeCall()

    // On trigger move/click desktop mouse
    input.controllers.forEach((c)=>{
        c.primaryButton.onDown.add(()=>{
            if(!screen){
                return
            }
            var hit = c.raycaster.intersectObject(screen)

            if(hit[0] && hit[0].uv){
                console.log("hit vid player")
                if(!localVideo.paused){
                    localVideo.pause()
                }else{
                    localVideo.play();
                    localVideo.muted = false
                }
                    
                // console.log(hit[0].uv)
                // socket.emit("robot", {action: "mouseMove", x: hit[0].uv.x, y: 1-hit[0].uv.y})
                // socket.emit("robot", {action: "mouseDown"})

                // c.primaryButton.onUp.addOnce(()=>{
                //     if(!screen){
                //         return
                //     }
                //     var hit = c.raycaster.intersectObject(screen)
                //     if(hit[0] && hit[0].uv){
                //         socket.emit("robot", {action: "mouseMove", x: hit[0].uv.x, y: 1-hit[0].uv.y})
                //     }
                //     socket.emit("robot", {action: "mouseUp"})
                // })
                
            }
        })
    })
}
main()