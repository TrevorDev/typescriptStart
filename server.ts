import * as express from "express"
import * as http from "http"
import * as sio from "socket.io";

var port = 3000;

// Basic express webserver
var app = express()
app.use("/public", express.static("public"))
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html")
})
var server = http.createServer(app)
server.listen(port)

