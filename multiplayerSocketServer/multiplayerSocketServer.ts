import * as http from "http"
import * as https from "https"
import sio from "socket.io";
import { Socket, CustomSocketData } from "./socket";
import { Room } from "./room";
import { Message } from "./Message";

export class MultiplayerSocketServer {
    io: sio.Namespace
    rooms: { [name: string]: Room } = {}
    constructor(server: http.Server | https.Server) {
        this.io = sio(server).of("/multiplayerSocketServer")
        this.io.on('connection', (socket: Socket) => {
            socket.customData = new CustomSocketData(socket)

            socket.on(Message.USERS_IN_ROOM, (data) => {
                if (this.rooms[data.room]) {
                    socket.emit(Message.USERS_IN_ROOM, { users: this.rooms[data.room].getSocketList() })
                }
            })

            socket.on(Message.JOINED_ROOM, (data) => {
                if (!this.rooms[data.room]) {
                    this.rooms[data.room] = new Room(data.room);
                }
                var room = this.rooms[data.room];
                room.addSocket(socket)
            })

            socket.on(Message.SEND_TO_USER, (msg) => {
                var to = msg.to
                msg.from = socket.id
                this.io.to(to).emit(Message.SEND_TO_USER, msg)
            })


            socket.on('disconnect', () => {
                var rooms = socket.customData.listRooms()
                for (var room in rooms) {
                    rooms[room].removeSocket(socket)
                }
            })
        });
    }
}