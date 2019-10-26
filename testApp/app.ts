import * as scli from "socket.io-client";
import { Message, Client } from "../multiplayerSocketServer/Message";

console.log("hit")

var main = async () => {
    var rtc = new RTCPeerConnection()

    var offer = await rtc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
    await rtc.setLocalDescription(offer);
    setTimeout(() => {

    }, 1000);

    var client = new Client(scli.default("http://localhost:3000/multiplayerSocketServer"))
    var data = await client.joinRoom("testRoom")
    console.log("I joined: " + data.room)

    data = await client.getUsersInRoom("testRoom")
    var users = Object.keys(data.users)
    users = users.filter((u) => {
        return u != client.io.id
    })
    var otherUser = users[0]
    console.log("me: " + client.io.id)
    console.log("Other user:" + otherUser)

    client.sendToUser(otherUser, {
        action: "setRTCDesc",
        localDescription: rtc.localDescription,
        remoteDescription: rtc.remoteDescription,
    })

    client.io.on(Message.SEND_TO_USER, async (msg: any) => {
        console.log("msg received")
        await rtc.setRemoteDescription(msg.data.localDescription);
        console.log("CONNECTED!")

        var localVideo = document.createElement("video")
        localVideo.autoplay = true
        //localVideo.muted = true;
        document.body.appendChild(localVideo)
        const remoteStream = new MediaStream(rtc.getReceivers().map(receiver => receiver.track));
        localVideo.srcObject = remoteStream
    });




}
main();