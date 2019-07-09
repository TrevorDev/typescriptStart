declare var io: any;


var uuid = createUUID();
var socket: SocketIO.Socket = io();
var isHub = window.location.search.length > 2;

var main = async () => {
    // Create video element
    var localVideo = document.createElement('video');
    localVideo.width = 100;
    localVideo.height = 100;
    localVideo.autoplay = true
    document.body.appendChild(localVideo)

    var remoteVideo = document.createElement('video');
    // remoteVideo.width = 100;
    // remoteVideo.height = 100;
    remoteVideo.autoplay = true
    document.body.appendChild(remoteVideo)

    // Create desktop stream
    var media: null | MediaStream = null;
    if (isHub) {
        media = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: true })
        //localVideo.srcObject = media;
    }   

    // Create rtc peer
    var peerConnection = new RTCPeerConnection({
        'iceServers': [
            { 'urls': 'stun:stun.stunprotocol.org:3478' },
            { 'urls': 'stun:stun.l.google.com:19302' },
        ]
    })
    peerConnection.onicecandidate = (event) => {
        if (event.candidate != null) {
            socket.emit("message", {'ice': event.candidate, 'uuid': uuid})
        }
    }
    var tracks:Array<MediaStreamTrack> = []
    peerConnection.ontrack = (event) => {
        console.log('got remote stream');
        console.log(event)
        tracks.push(event.track)
        remoteVideo.srcObject = new MediaStream(tracks);
    }
    if (media) {
        for (var track of media.getTracks()) {
            console.log("Add local track")
            
            peerConnection.addTrack(track)
        }
    }else{
        //localVideo.getTr
        //var track = new MediaStreamTrack()
        //peerConnection.addTrack(null)
    }

    var createDesc = async (desc:RTCSessionDescriptionInit)=>{
        await peerConnection.setLocalDescription(desc)
        socket.emit("message", { 'sdp': peerConnection.localDescription, 'uuid': uuid })
    }

    if (!isHub) {
        console.log('Create offer');
        var desc = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true})
        await createDesc(desc)
        console.log('Offer created');
    }

    socket.on("message", async (m, s) => {
        var signal = s;
        // Ignore messages from ourself
        if (signal.uuid == uuid) return;
        console.log("Got msg")
        console.log(s)
        if (signal.sdp) {
            console.log("sdp")
            await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp))

            // Only create answers in response to offers
            if (signal.sdp.type == 'offer') {
                console.log('Create answer');
                var desc = await peerConnection.createAnswer({offerToReceiveAudio: false, offerToReceiveVideo: false})
                await createDesc(desc)
                console.log('Answered');
            }

        } else if (signal.ice) {
            console.log("ice")
            await peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice))
        }
    })
}
main()

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function createUUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}