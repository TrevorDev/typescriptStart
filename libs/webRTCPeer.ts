const RTCPeerConnection = require('wrtc').RTCPeerConnection;

const TIME_TO_CONNECTED = 10000;
const TIME_TO_HOST_CANDIDATES = 3000;  // NOTE(mroberts): Too long.
const TIME_TO_RECONNECTED = 10000;

export class WebRtcPeer {
    peerConnection: webkitRTCPeerConnection
    reconnectionTimer: number | null = null;
    connectionTimer: any = setTimeout(() => {
        if (this.peerConnection.iceConnectionState !== 'connected'
            && this.peerConnection.iceConnectionState !== 'completed') {
            //this.close();
        }
    }, TIME_TO_CONNECTED);

    constructor() {
        this.peerConnection = new RTCPeerConnection({
            sdpSemantics: 'unified-plan'
        });

        const onIceConnectionStateChange = () => {
            if (this.peerConnection.iceConnectionState === 'connected'
                || this.peerConnection.iceConnectionState === 'completed') {
                if (this.connectionTimer) {
                    clearTimeout(this.connectionTimer);
                    this.connectionTimer = null;
                }
                clearTimeout(this.reconnectionTimer as number);
                this.reconnectionTimer = null;
            } else if (this.peerConnection.iceConnectionState === 'disconnected'
                || this.peerConnection.iceConnectionState === 'failed') {
                if (!this.connectionTimer && !this.reconnectionTimer) {
                    const self = this;
                    this.reconnectionTimer = setTimeout(() => {
                        //self.close();
                    }, TIME_TO_RECONNECTED) as any;
                }
            }
        };

        this.peerConnection.addEventListener('iceconnectionstatechange', onIceConnectionStateChange);


    }

    async waitUntilIceGatheringStateComplete(peerConnection: any, options: any) {
        console.log("A")
        if (peerConnection.iceGatheringState === 'complete') {
            return;
        }
        console.log("B")
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                peerConnection.removeEventListener('icecandidate', onIceCandidate);
                reject(new Error('Timed out waiting for host candidates'));
            }, TIME_TO_HOST_CANDIDATES);

            function onIceCandidate(c: any) {
                console.log("E")
                if (!c.candidate) {
                    clearTimeout(timeout);
                    peerConnection.removeEventListener('icecandidate', onIceCandidate);
                    resolve();
                }
            }

            console.log("C")
            peerConnection.addEventListener('icecandidate', onIceCandidate);
        });
    }

    async doOffer() {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        await this.waitUntilIceGatheringStateComplete(this.peerConnection, {});
    }

    applyAnswer = async (answer: any) => {
        await this.peerConnection.setRemoteDescription(answer);
    };

    toJSON = () => {
        return {
            iceConnectionState: this.peerConnection.iceConnectionState,
            localDescription: this.peerConnection.localDescription,
            remoteDescription: this.peerConnection.remoteDescription,
            signalingState: this.peerConnection.signalingState
        };
    };
}

