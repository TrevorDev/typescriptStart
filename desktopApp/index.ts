const { desktopCapturer } = require('electron')

//var vidEl = document.createElement("video")
var main = async () => {
    // debugger
    var sources = await desktopCapturer.getSources({ types: ['window', 'screen'] })
    var chosenSrc = null;
    for (const source of sources) {
        if (source.name === 'Screen 1') {
            try {
                const stream = await (navigator.mediaDevices.getUserMedia as any)({
                    audio: false,
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
}
main()