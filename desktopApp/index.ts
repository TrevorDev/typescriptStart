import { desktopCapturer } from 'electron'
import * as scli from "socket.io-client";
import { Message, Client } from "../multiplayerSocketServer/Message";
import * as $ from 'jquery'



var main = async () => {
    var c = 0;
    // Get ip address (used for creating room)
    var serverUrl = "http://localhost:3000"
    var ipAddress = (await $.get(serverUrl + "/whatsMyIp")).ip;
    var roomName = "desktopShare-" + ipAddress
    console.log(roomName)

    // Establish connection to socketIO server
    var client = new Client(scli.default(serverUrl + "/multiplayerSocketServer"))
    var data = await client.joinRoom(roomName)
    console.log("I joined: " + data.room)

    data = await client.getUsersInRoom(roomName)
    console.log("Users in room:" + Object.keys(data.users).length)

    client.io.on(Message.SEND_TO_USER, async (msg: any) => {
        console.log(msg)
        if (msg.data.action == "setRTCDesc") {
            // Get desktop stream
            var sources = await desktopCapturer.getSources({ types: ['window', 'screen'] })
            var chosenSrc: MediaStream | null = null;
            for (const source of sources) {
                if (source.name === 'Screen 1') {
                    try {
                        const stream = await (navigator.mediaDevices.getUserMedia as any)({
                            audio: {
                                mandatory: {
                                    chromeMediaSource: 'desktop'
                                }
                            },
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: source.id,
                                    minWidth: 1280,
                                    maxWidth: 1280,
                                    minHeight: 720,
                                    maxHeight: 720
                                }
                            }
                        })
                        chosenSrc = stream
                        break;
                    } catch (e) {
                        console.log("stream err")
                    }
                }
            }
            if (!chosenSrc) {
                console.log("no desktop stream found")
                return
            }

            // Create video element
            var localVideo = document.createElement("video")
            localVideo.autoplay = true
            localVideo.muted = true;
            //document.body.appendChild(localVideo)
            localVideo.srcObject = chosenSrc
            localVideo.onloadedmetadata = (e) => localVideo.play()

            // Create RTC peer which will receive call
            var rtcPeer = new RTCPeerConnection();
            var conId = c++;

            rtcPeer.onconnectionstatechange = function (event) {
                if ("disconnected" == rtcPeer.connectionState) {
                    console.log(conId)
                    console.log(rtcPeer.connectionState)
                    //document.body.removeChild(localVideo)
                    localVideo.srcObject = null;
                    rtcPeer.close()
                }
            }

            await rtcPeer.setRemoteDescription(msg.data.localDescription)

            var stream = chosenSrc!
            // Set video out to be local video element and video in from server
            stream.getTracks().forEach(track => rtcPeer.addTrack(track, stream));

            // const remoteStream = new MediaStream(rtc.getReceivers().map(receiver => receiver.track));
            // remoteVideo.srcObject = remoteStream;

            // create answer to to server's offer
            const originalAnswer = await rtcPeer.createAnswer();
            console.log("created answer")
            const updatedAnswer = new RTCSessionDescription({
                type: 'answer',
                sdp: originalAnswer.sdp
            });
            await rtcPeer.setLocalDescription(updatedAnswer);

            client.sendToUser(msg.from, { localDescription: rtcPeer.localDescription })
        }
    })
}
main()