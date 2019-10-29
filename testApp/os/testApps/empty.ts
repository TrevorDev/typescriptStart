import { OS } from "../os"
import { App } from "../app/app"

var os = OS.GetOS()
os.registerApp({
    appName: "Empty",
    iconImage: "/public/img/video.png",
    create: (app: App) => {


        app.update = (delta) => {

        }

        app.dispose = () => {

        }
    }
})