import $ from "jquery"

console.log("hit")


var main = async () => {
    var localVideo = document.createElement("video")
    localVideo.autoplay = true
    localVideo.muted = true;
    document.body.appendChild(localVideo)

    var remoteVideo = document.createElement("video")
    remoteVideo.autoplay = true
    document.body.appendChild(remoteVideo)

    const localPeerConnection = new RTCPeerConnection();


    var resp = await $.get("/connections")
    console.log(resp)

    localPeerConnection.setRemoteDescription(resp.localDescription)


    var stereo = false

    const localStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    });

    localVideo.srcObject = localStream;
    localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));

    const remoteStream = new MediaStream(localPeerConnection.getReceivers().map(receiver => receiver.track));
    remoteVideo.srcObject = remoteStream;

    // NOTE(mroberts): This is a hack so that we can get a callback when the
    // RTClocalPeerConnection is closed. In the future, we can subscribe to
    // "connectionstatechange" events.
    const { close } = localPeerConnection;
    localPeerConnection.close = function () {
        console.log("closed")
        remoteVideo.srcObject = null;

        localVideo.srcObject = null;

        localStream.getTracks().forEach(track => track.stop());

        return close.apply(this, arguments);
    };


    const originalAnswer = await localPeerConnection.createAnswer();
    console.log("created answer")
    const updatedAnswer = new RTCSessionDescription({
        type: 'answer',
        //sdp: stereo ? enableStereoOpus(originalAnswer.sdp) : originalAnswer.sdp
        sdp: originalAnswer.sdp
    });
    await localPeerConnection.setLocalDescription(updatedAnswer);

    console.log("set local desc")

    // await fetch(`${host}${prefix}/connections/${id}/remote-description`, {
    //     method: 'POST',
    //     body: JSON.stringify(localPeerConnection.localDescription),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    await $.ajax({
        url: `/connections/1/remote-description`,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(localPeerConnection.localDescription)
    });
}
main()


// async function beforeAnswer(peerConnection) {
//     const localStream = await window.navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true
//     });

//     localVideo.srcObject = localStream;
//     localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//     const remoteStream = new MediaStream(peerConnection.getReceivers().map(receiver => receiver.track));
//     remoteVideo.srcObject = remoteStream;

//     // NOTE(mroberts): This is a hack so that we can get a callback when the
//     // RTCPeerConnection is closed. In the future, we can subscribe to
//     // "connectionstatechange" events.
//     const { close } = peerConnection;
//     peerConnection.close = function() {
//       remoteVideo.srcObject = null;

//       localVideo.srcObject = null;

//       localStream.getTracks().forEach(track => track.stop());

//       return close.apply(this, arguments);
//     };
//   }