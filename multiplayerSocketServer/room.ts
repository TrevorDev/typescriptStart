import { Socket } from "./socket";
import { MultiplayerSocketServer } from "./multiplayerSocketServer";
import { Message } from "./Message";

export class Room {
    private sockets: { [id: string]: Socket } = {}
    constructor(public name: string) {

    }
    addSocket(s: Socket) {
        if (!this.sockets[s.id]) {
            this.sockets[s.id] = s;
            s.customData.joinRoom(this)
            this.broadcast({ msg: Message.JOINED_ROOM, data: { room: this.name, user: s } })
        }
    }
    removeSocket(s: Socket) {
        if (this.sockets[s.id]) {
            delete this.sockets[s.id];
            s.customData.leaveRoomn(this)
            this.broadcast({ msg: Message.LEFT_ROOM, data: { room: this.name, user: s } })
        }
    }

    getSocketList() {
        return this.sockets
    }

    broadcast(o: { msg: string, data: any, exceptSocket?: Socket }) {
        for (var id in this.sockets) {
            if (!o.exceptSocket || id != o.exceptSocket.id) {
                this.sockets[id].emit(o.msg, o.data)
            }
        }
    }

}