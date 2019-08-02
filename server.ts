import express from "express"
import * as http from "http"
import * as fs from "fs"
import sio from "socket.io";
import * as https from "https"

import program from "commander"

program
  .version('0.1.0')
  .option('-p, --port [port]', 'port to run on')
  .parse(process.argv)

var port = program.port ? program.port : 443
console.log("Starting on port: "+port)

// Basic express webserver
var app = express()
app.use("/public", express.static("public"))
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html")
})
app.get('/screenCapture', function (req, res) {
    res.sendFile(process.cwd() + "/public/screenCapture.html")
})
app.get('/slice', function (req, res) {
    res.sendFile(process.cwd() + "/public/slice.html")
})

// var server = http.createServer(app)
// server.listen(port)
var sserver = port != 443 ? http.createServer(app) : https.createServer({key:fs.readFileSync('cert/key.pem').toString(), cert: fs.readFileSync('cert/certificate.pem').toString()}, app)
sserver.listen(port);
// var io = sio(sserver)
// io.on('connection', (socket) => {
//     console.log("connect")
//     socket.on("message", (e)=>{
//         socket.broadcast.send("message", e)
//     })

//     socket.on("robot", (e)=>{
//         if(e.action == "mouseMove"){
//             var screenSize = robot.getScreenSize();
//             robot.moveMouse(screenSize.width*e.x,screenSize.height*e.y)
//         }else if(e.action == "mouseDown"){
//             robot.mouseToggle("down")
//         }else if(e.action == "mouseUp"){
//             robot.mouseToggle("up")
//         }
//     })
// });