import appFactory from "./libs/appFactory";
import config from "./libs/config"

import browserify = require("browserify")

var main = async ()=>{
  var app = appFactory.createApp();

  app.get('/',async function(req, res) {
		res.render('index')
	});

  app.get('/browserify/*', function(req, res) {
		//TODO: cache this in production or generate all files beforehand
		let reqFile:string = req.params[0]
		if(config.env == "DEV"){
			let stream = browserify(["./public/ts/"+reqFile]).bundle()
			stream.on("data", function(buffer){
				res.write(buffer)
			})
			stream.on("end", function(){
				res.end()
			})
		}else{
			res.sendfile(reqFile, {root: './public/compiledTS'});
		}
	});

  app.listen(3000, function(){
	    console.log("Server running");
	});
}
main()
