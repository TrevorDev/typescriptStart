'use strict';

const DefaultRTCPeerConnection = require('wrtc').RTCPeerConnection;

const TIME_TO_CONNECTED = 10000;
const TIME_TO_HOST_CANDIDATES = 3000;  // NOTE(mroberts): Too long.
const TIME_TO_RECONNECTED = 10000;

function descriptionToJSON(description: any, shouldDisableTrickleIce?: any) {
    return !description ? {} : {
        type: description.type,
        sdp: shouldDisableTrickleIce ? disableTrickleIce(description.sdp) : description.sdp
    };
}

function disableTrickleIce(sdp: any) {
    return sdp.replace(/\r\na=ice-options:trickle/g, '');
}

async function waitUntilIceGatheringStateComplete(peerConnection: any, options: any) {
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


export class WebRtcPeer {
    peerConnection: webkitRTCPeerConnection
    reconnectionTimer: number | null = null;
    connectionTimer: any = setTimeout(() => {
        if (this.peerConnection.iceConnectionState !== 'connected'
            && this.peerConnection.iceConnectionState !== 'completed') {
            //this.close();
        }
    }, TIME_TO_CONNECTED);

    async doOffer() {
        console.log("c o")
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        console.log("ld s")
        try {
            await waitUntilIceGatheringStateComplete(this.peerConnection, {});
            console.log("d")
        } catch (error) {
            // this.close();
            throw error;
        }
    }

    applyAnswer = async (answer: any) => {
        await this.peerConnection.setRemoteDescription(answer);
    };

    // close = () => {
    //     this.peerConnection.removeEventListener('iceconnectionstatechange', onIceConnectionStateChange);
    //     if (this.connectionTimer) {
    //         clearTimeout(this.connectionTimer);
    //         this.connectionTimer = null;
    //     }
    //     if (this.reconnectionTimer) {
    //         clearTimeout(this.reconnectionTimer);
    //         this.reconnectionTimer = null;
    //     }
    //     this.peerConnection.close();
    //     //super.close();
    // };

    toJSON = () => {
        return {
            iceConnectionState: this.peerConnection.iceConnectionState,
            localDescription: this.peerConnection.localDescription,
            remoteDescription: this.peerConnection.remoteDescription,
            signalingState: this.peerConnection.signalingState
        };
    };

    constructor() {
        this.peerConnection = new DefaultRTCPeerConnection({
            sdpSemantics: 'unified-plan'
        });



        let reconnectionTimer: any = null;

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





        Object.defineProperties(this, {
            iceConnectionState: {
                get() {
                    return this.peerConnection.iceConnectionState;
                }
            },
            localDescription: {
                get() {
                    return descriptionToJSON(this.peerConnection.localDescription, true);
                }
            },
            remoteDescription: {
                get() {
                    return descriptionToJSON(this.peerConnection.remoteDescription);
                }
            },
            signalingState: {
                get() {
                    return this.peerConnection.signalingState;
                }
            }
        });
    }
}

