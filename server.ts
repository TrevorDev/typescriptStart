import express from "express"
import * as http from "http"
import sio from "socket.io";
import program from "commander"
import { MultiplayerSocketServer } from "./multiplayerSocketServer/multiplayerSocketServer";

program
  .version('0.1.0')
  .option('-p, --port [port]', 'port to run on')
  .parse(process.argv)

var port = program.port ? program.port : 3000
console.log("Starting on port: " + port)

// Basic express webserver
var app = express()
app.use("/public", express.static("public"))
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html")
})
app.get('/whatsMyIp', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log(ip)
  res.send({ ip: ip })
})
var server = http.createServer(app)
server.listen(port)

var mps = new MultiplayerSocketServer(server)

