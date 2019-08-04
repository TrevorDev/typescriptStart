import * as express from "express"
import * as http from "http"
import * as sio from "socket.io";
import * as program from "commander"

program
  .version('0.1.0')
  .option('-p, --port [port]', 'port to run on')
  .parse(process.argv)

var port = program.port ? program.port : 3000
console.log("Starting on port: "+port)

// Basic express webserver
var app = express()
app.use("/public", express.static("public"))
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + "/public/index.html")
})
var server = http.createServer(app)
server.listen(port)

