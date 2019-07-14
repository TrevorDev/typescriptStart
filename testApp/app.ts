import { NiftyOS } from "./niftyOS/niftyOS";

// Get rid of margin
document.documentElement.style["overflow"]="hidden"
document.documentElement.style.overflow ="hidden"
document.documentElement.style.width ="100%"
document.documentElement.style.height ="100%"
document.documentElement.style.margin ="0"
document.documentElement.style.padding ="0"
document.body.style.overflow ="hidden"
document.body.style.width ="100%"
document.body.style.height ="100%"
document.body.style.margin ="0"
document.body.style.padding ="0"

var div = document.createElement("div")
div.style.width = "100%"
div.style.height = "100%"
document.body.appendChild(div)

var os = new NiftyOS(div)