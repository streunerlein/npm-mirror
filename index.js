
var server = "http://localhost:5984";
var fetchServer = "ec2-46-137-149-160.eu-west-1.compute.amazonaws.com";

var nano = require("nano")(server),
	express = require("express");

var app = express.createServer();
var db = nano.db.use("registry");
app.listen(80);

app.get('/:doc/:at', function(req, res) {
  db.attachment.get(req.params.doc, req.params.at).pipe(res);
});

app.get('/:doc', function(req, res){
  db.get(req.params.doc, function(err, body) {
  	if (!err) {
  		if ("versions" in body) {
  			var versions = body.versions;
  			for (var k in versions) {
  				if ("dist" in versions[k]) {
  					versions[k].dist.tarball = versions[k].dist.tarball.replace("registry.npmjs.org", fetchServer);
  					versions[k].dist.tarball = versions[k].dist.tarball.replace("\/-\/", "/");
  				}
  			}
  		}
  		res.send(body);
  	}
  	else {
  		res.send("notfound");
  	}
  })
});
