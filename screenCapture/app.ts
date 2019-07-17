import { WebRTCPeer } from "./WebRTCPeer";

declare var io: any;
var socket: SocketIO.Socket = io();

var isHub = window.location.search.length > 2;
var main = async()=>{
    // Create video element
    var localVideo = document.createElement('video');
    localVideo.width = 800;
    localVideo.autoplay = true
    localVideo.muted = true
    document.body.appendChild(localVideo)

    var peer = new WebRTCPeer(socket)

    // Create desktop stream
    if(isHub){
        localVideo.muted = true
        //
        var media:MediaStream = await (navigator.mediaDevices as any)
        .getDisplayMedia({ video: {width:1920/2, height:1080/2}, audio: true })
        localVideo.srcObject = media;
        peer.addTracks(media)
        
    }else{
        peer.setVideoElement(localVideo)
        peer.makeCall()
    }
    
}

setTimeout(() => {
    main()
}, 500);
