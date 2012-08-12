
var server = "http://ec2-79-125-28-91.eu-west-1.compute.amazonaws.com";

var nano = require("nano")(server + ":80"),
	express = require("express");

var app = express.createServer();
var db = nano.db.use("registry");
app.listen(8010);

app.get('/registry/:doc', function(req, res){
	console.log("get",req.params.doc)
  db.get(req.params.doc, function(err, body) {
  	if (!err) {
  		console.log(body)
  		if ("versions" in body) {
  			var versions = body.versions;
  			for (var k in versions) {
  				if ("dist" in versions[k]) {
  					versions[k].dist.tarball = versions[k].dist.tarball.replace("registry.npmjs.org", server);
  					versions[k].dist.tarball = versions[k].dist.tarball.replace("\/-\/", "/");
  				}
  			}
  		}
  		res.send(body);
  	}
  	else {
  		res.send("notfound:",err.message);
  	}
  })
});