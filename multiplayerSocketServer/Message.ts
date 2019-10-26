export class Message {
    static MSGPrefix = "mss-"

    static USERS_IN_ROOM = Message.MSGPrefix + "usersInRoom"
    static LEFT_ROOM = Message.MSGPrefix + "leftRoom"
    static JOINED_ROOM = Message.MSGPrefix + "joinedRoom"
    static SEND_TO_USER = Message.MSGPrefix + "sendToUser"
}

export class Client {
    constructor(public io: SocketIOClient.Socket) {

    }

    async joinRoom(room: string) {
        return new Promise<any>((res, rej) => {
            this.io.emit(Message.JOINED_ROOM, { room: room })

            this.io.on(Message.JOINED_ROOM, (data: any) => {
                if (data.user.id == this.io.id) {
                    res(data)
                }
            })
        })
    }

    async getUsersInRoom(room: string) {
        return new Promise<any>((res, rej) => {
            this.io.emit(Message.USERS_IN_ROOM, { room: room })

            this.io.on(Message.USERS_IN_ROOM, (data: any) => {
                res(data)
            })
        })
    }

    sendToUser(user: string, data: {}) {
        this.io.emit(Message.SEND_TO_USER, { to: user, data: data })
    }
}