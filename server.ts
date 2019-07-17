import * as express from "express"
import * as http from "http"
import * as fs from "fs"
import * as sio from "socket.io";
import * as https from "https"

import * as robot from "robotjs"
var port = 3000;

// Basic express webserver
var app = express()
app.use("/public", express.static("public"))
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html")
})
app.get('/screenCapture', function (req, res) {
    res.sendFile(process.cwd() + "/public/screenCapture.html")
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

    socket.on("robot", (e)=>{
        if(e.action == "mouseMove"){
            var screenSize = robot.getScreenSize();
            robot.moveMouse(screenSize.width*e.x,screenSize.height*e.y)
        }else if(e.action == "mouseDown"){
            robot.mouseToggle("down")
        }else if(e.action == "mouseUp"){
            robot.mouseToggle("up")
        }
    })
});