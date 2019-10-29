import sio from "socket.io";
import { Room } from "./room";

export class CustomSocketData {
    private rooms: { [id: string]: Room } = {}
    constructor(private socket: Socket) {
        socket.toJSON = () => {
            return { id: socket.id }
        }
    }
    joinRoom(room: Room) {
        if (!this.rooms[room.name]) {
            this.rooms[room.name] = room
            room.addSocket(this.socket)
        }
    }
    leaveRoomn(room: Room) {
        if (this.rooms[room.name]) {
            delete this.rooms[room.name]
            room.removeSocket(this.socket)
        }
    }
    listRooms() {
        return this.rooms
    }

    toJSON() {
        return {}
    }
}

export interface Socket extends sio.Socket {
    customData: CustomSocketData
    toJSON: Function
}