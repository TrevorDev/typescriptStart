import * as express from "express"
import * as http from "http"
import * as fs from "fs"
import * as sio from "socket.io";
import * as https from "https"
var port = 3000;

// Basic express webserver
var app = express()
app.use("/public", express.static("public"))
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html")
})

// var server = http.createServer(app)
// server.listen(port)
var sserver = https.createServer({key:fs.readFileSync('cert/key.pem').toString(), cert: fs.readFileSync('cert/certificate.pem').toString()}, app)
sserver.listen(443);
var io = sio(sserver)
io.on('connection', (socket) => {
    console.log("connect")
    socket.on("message", (e)=>{
        socket.broadcast.send("message", e)
    })
})