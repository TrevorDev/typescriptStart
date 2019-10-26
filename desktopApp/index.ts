const { desktopCapturer, ipcRenderer } = require('electron')
var e = require('electron')
import * as scli from "socket.io-client";
import { MultiplayerSocketServer } from "../multiplayerSocketServer/multiplayerSocketServer";
import { Message, Client } from "../multiplayerSocketServer/Message";

// let displays = e.screen.getAllDisplays()
// console.log(displays)
// 

// var e = require('electron')
// let displays = e.screen.getAllDisplays()
// console.log(displays)
//var vidEl = document.createElement("video")
console.log(ipcRenderer.sendSync('getScreens'))

var main = async () => {
    // debugger
    var sources = await desktopCapturer.getSources({ types: ['window', 'screen'] })
    console.log(sources)
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
    var localVideo = document.createElement("video")
    localVideo.autoplay = true
    localVideo.muted = true;
    document.body.appendChild(localVideo)
    localVideo.srcObject = chosenSrc
    localVideo.onloadedmetadata = (e) => localVideo.play()

    // this receives a call and sends desktop screen/audio
    var rtc = new RTCPeerConnection();


    var client = new Client(scli.default("http://localhost:3000/multiplayerSocketServer"))
    var data = await client.joinRoom("testRoom")
    console.log("I joined: " + data.room)

    data = await client.getUsersInRoom("testRoom")
    console.log("Users in room:" + Object.keys(data.users).length)

    client.io.on(Message.SEND_TO_USER, async (msg: any) => {
        console.log(msg)
        if (msg.data.action == "setRTCDesc") {
            await rtc.setRemoteDescription(msg.data.localDescription)

            var stream = chosenSrc!
            // Set video out to be local video element and video in from server
            stream.getTracks().forEach(track => rtc.addTrack(track, stream));

            // const remoteStream = new MediaStream(rtc.getReceivers().map(receiver => receiver.track));
            // remoteVideo.srcObject = remoteStream;

            // create answer to to server's offer
            const originalAnswer = await rtc.createAnswer();
            console.log("created answer")
            const updatedAnswer = new RTCSessionDescription({
                type: 'answer',
                sdp: originalAnswer.sdp
            });
            await rtc.setLocalDescription(updatedAnswer);

            client.sendToUser(msg.from, { localDescription: rtc.localDescription })
        }
    })
}
main()