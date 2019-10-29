import * as scli from "socket.io-client";
import { Message, Client } from "../multiplayerSocketServer/Message";
import * as $ from 'jquery'

var main = async () => {
    // Figure out connection to socketIO
    var serverUrl = "http://localhost:3000"
    var ipAddress = (await $.get(serverUrl + "/whatsMyIp")).ip;
    var roomName = "desktopShare-" + ipAddress

    // Create webRTC offer
    var rtc = new RTCPeerConnection()

    var offer = await rtc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
    await rtc.setLocalDescription(offer);

    var p = new Promise((res) => {
        rtc.addEventListener('icecandidate', (c) => {
            if (!c.candidate) {
                res()
            }
        });
    })

    await p;

    // Create socketIO client and join room
    var client = new Client(scli.default("http://localhost:3000/multiplayerSocketServer"))
    var data = await client.joinRoom(roomName)
    console.log("I joined: " + data.room)

    data = await client.getUsersInRoom(roomName)
    var users = Object.keys(data.users)
    users = users.filter((u) => {
        return u != client.io.id
    })
    var otherUser = users[0]
    console.log("me: " + client.io.id)
    console.log("Other user:" + otherUser)

    // Start video call to get desktop
    client.sendToUser(otherUser, {
        action: "setRTCDesc",
        localDescription: rtc.localDescription,
        remoteDescription: rtc.remoteDescription,
    })

    // Receive answer to call
    client.io.on(Message.SEND_TO_USER, async (msg: any) => {
        console.log("msg received")
        await rtc.setRemoteDescription(msg.data.localDescription);
        console.log("CONNECTED!")

        var localVideo = document.createElement("video")
        localVideo.autoplay = true
        //localVideo.muted = true;
        document.body.appendChild(localVideo)
        console.log(rtc.getReceivers())
        const remoteStream = new MediaStream(rtc.getReceivers().map(receiver => receiver.track));
        localVideo.srcObject = remoteStream
    });
}
main();