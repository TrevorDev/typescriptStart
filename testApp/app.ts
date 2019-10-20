import $ from "jquery"

var main = async () => {
    // Init video elements
    var localVideo = document.createElement("video")
    localVideo.autoplay = true
    localVideo.muted = true;
    document.body.appendChild(localVideo)

    var remoteVideo = document.createElement("video")
    remoteVideo.autoplay = true
    document.body.appendChild(remoteVideo)

    // Record from camera to local video
    const localStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    });
    localVideo.srcObject = localStream;

    // Connect to server and get server to offer a connection
    const localPeerConnection = new RTCPeerConnection();
    var resp = await $.get("/connections")
    localPeerConnection.setRemoteDescription(resp.localDescription)


    // Set video out to be local video element and video in from server
    localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));

    const remoteStream = new MediaStream(localPeerConnection.getReceivers().map(receiver => receiver.track));
    remoteVideo.srcObject = remoteStream;

    // create answer to to server's offer
    const originalAnswer = await localPeerConnection.createAnswer();
    console.log("created answer")
    const updatedAnswer = new RTCSessionDescription({
        type: 'answer',
        sdp: originalAnswer.sdp
    });
    await localPeerConnection.setLocalDescription(updatedAnswer);

    // Send answer to server to connect
    await $.ajax({
        url: `/connections/1/remote-description`,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(localPeerConnection.localDescription)
    });
}
main()