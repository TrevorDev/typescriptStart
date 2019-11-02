import { OS } from "../os"
import { App } from "../app/app"
import { CanvasTexture } from "../../extensions/canvasTexture"
import { BasicMaterial } from "../../componentObject/components/material/basicMaterial"
import { DefaultMesh } from "../../extensions/defaultMesh"
import { DefaultVertexData } from "../../extensions/defaultVertexData"
import { Vector3 } from "../../math/vector3"
import { Texture } from "../../gpu/texture"
import { VideoTexture } from "../../extensions/videoTexture"
import { Client, Message } from "../../../multiplayerSocketServer/Message"
import * as scli from "socket.io-client";
import * as $ from 'jquery'
import { Hit, HitResult } from "../../extensions/hit"

var os = OS.GetOS()
os.registerApp({
    appName: "Desktop",
    iconImage: "/public/img/video.png",
    create: async (app: App) => {
        let vt: any = null
        let screen: any = null
        console.log("DESKTOP!")
        // Figure out connection to socketIO
        var serverUrl = "http://localhost:3000"
        var ipAddress = (await $.get(serverUrl + "/whatsMyIp")).ip;
        var roomName = "desktopShare-" + ipAddress
        console.log("ROOM!")
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
        console.log("ICE!")
        // Create socketIO client and join room
        var client = new Client(scli.default("http://localhost:3000/multiplayerSocketServer"))
        var data = await client.joinRoom(roomName)
        console.log("I joined: " + data.room)

        console.log("JOIN!")

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

            setTimeout(() => {
                try {
                    screen = DefaultMesh.createMesh(os.device, { vertexData: DefaultVertexData.createPlaneVertexData(os.device) });
                    screen.transform.scale.x = 1920 / 1080
                    screen.transform.scale.scaleInPlace(1)
                    screen.transform.position.y = screen.transform.scale.z / 2 + 0.05
                    app.scene.transform.addChild(screen.transform)
                    var euler = new Vector3(0, 0, 0)
                    euler.x = Math.PI / 2
                    screen.transform.rotation.fromEuler(euler);

                    vt = new VideoTexture(os.device, "");
                    vt.videoElement = localVideo;
                    (screen.material.material as BasicMaterial).diffuseTexture = vt.texture


                    // vt.videoElement.play()
                    console.log("play")
                } catch (e) {
                    console.log(e)
                }

            }, 100);

        });

        var hitRes = new HitResult()
        var lastSend = 0;
        app.update = (delta, cur, controllers) => {
            if (vt) {
                vt.update()


                controllers.forEach((c) => {
                    Hit.rayIntersectsMeshes(c.ray, [screen], hitRes)
                    if (hitRes.hitDistance) {
                        if (cur - lastSend > 0.1) {
                            client.sendToUser(otherUser, {
                                action: "mouseMove",
                                x: hitRes.hitTexcoord.x,
                                y: hitRes.hitTexcoord.y
                            })
                            lastSend = cur;
                        }

                        if (c.primaryButton.justDown) {
                            client.sendToUser(otherUser, {
                                action: "mouseDown"
                            })
                        }
                        if (c.primaryButton.justUp) {
                            client.sendToUser(otherUser, {
                                action: "mouseUp"
                            })
                        }
                    }

                })
            }
        }

        app.castRay = (ray, result) => {
            if (screen) {
                Hit.rayIntersectsMeshes(ray, [screen], result)
                // if (result.hitDistance) {

                //     if (!isNaN(result.hitTexcoord.x) && !isNaN(result.hitTexcoord.y)) {
                //         console.log(result.hitTexcoord.x)
                //         console.log(result.hitTexcoord.y)
                //         console.log("\n")

                //     }


                // }
            }

        }

        app.dispose = () => {

        }
    }
})