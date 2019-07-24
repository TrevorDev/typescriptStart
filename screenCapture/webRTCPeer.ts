import { Observable } from "../testApp/niftyOS/events/observable";

export class WebRTCPeer {
    uuid = createUUID()
    connection:RTCPeerConnection
    connectionCreated = new Observable<WebRTCPeer>()
    trackAdded = new Observable<WebRTCPeer>()
    constructor(private socket:SocketIO.Socket){
        this.createConnection()

    
        socket.on("message", async (m, s) => {
            var signal = s;
            // Ignore messages from ourself
            if (signal.uuid == this.uuid){
                return;
            } 

            if (signal.sdp) {
                if (signal.sdp.type == 'offer') {
                   //this.createConnection()
                }
                console.log(signal.sdp.type)
                await this.connection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
    
                // Only create answers in response to offers
                if (signal.sdp.type == 'offer') {
                    console.log('Create answer');
                    //await this.connection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    var desc = await this.connection.createAnswer({offerToReceiveAudio: false, offerToReceiveVideo: false})
                    await this.createDesc(desc)
                    console.log('Answered');
                }
    
            } else if (signal.ice) {
                console.log("ice")
                await this.connection.addIceCandidate(new RTCIceCandidate(signal.ice))
            }
        })
    }

    async createDesc(desc:RTCSessionDescriptionInit){
        await this.connection.setLocalDescription(desc)
        this.socket.emit("message", { 'sdp': this.connection.localDescription, 'uuid': this.uuid })
    }

    addTracks(stream:MediaStream){
        for (var track of stream.getTracks()) {
            this.connection.addTrack(track, stream)
        }
    }

    createConnection(){
        if(this.connection){
            this.connection.close()
        }
        this.connection = new RTCPeerConnection({
            iceServers: [{urls: "stun:stun.1.google.com:19302"}]
        })

        this.connection.onicecandidate = (event) => {
            if (event.candidate != null) {
                this.socket.emit("message", {'ice': event.candidate, 'uuid': this.uuid})
            }
        }
        this.connectionCreated.notifyObservers(this)
    }

    // TODO REOMOVE
    setVideoElement(element:HTMLVideoElement){
        var tracks:Array<MediaStreamTrack> = []
        this.connection.ontrack = (event) => {
            console.log("got tracks")
            console.log(event)
            
            //tracks.push(event.track)
            //setTimeout(() => {
                element.srcObject = event.streams[0];
                element.onloadedmetadata = (e)=> {
                    console.log("load")
                    try{
                        element.play();
                        element.muted = false
                        this.trackAdded.notifyObservers(this)
                    }catch(e){
                        console.log(e)
                    }
                    
                  };
                // event.streams[0].onactive = ()=>{
                //     console.log("active")
                // }
                // event.streams[0].oninactive = ()=>{
                //     console.log("inactive2")
                // }
            //}, 1000);
            
        }
    }

    async makeCall(){
        var desc = await this.connection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true})
        await this.createDesc(desc)
    }

    dispose(){
        this.connection.close()
    }
}

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function createUUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}