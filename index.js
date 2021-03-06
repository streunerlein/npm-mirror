
var server = "http://localhost:5984";
var fetchServer = "ec2-46-137-149-160.eu-west-1.compute.amazonaws.com";

var nano = require("nano")(server),
  express = require("express");

var app = express.createServer();
var db = nano.db.use("registry");
app.listen(80);

var adjustTarball = function(version) {
  version.dist.tarball = version.dist.tarball.replace("registry.npmjs.org", fetchServer);
  version.dist.tarball = version.dist.tarball.replace("\/-\/", "/");
};

app.get('/:doc/:at', function(req, res) {
  if (isNaN(req.params.at.substring(0, 1))) {
    db.attachment.get(req.params.doc, req.params.at).pipe(res);
  }
  else {
    db.get(req.params.doc, function(err, body) {
      if (!err) {
        if ("versions" in body && req.params.at in body.versions) {
          var version = body.versions[req.params.at];
          if ("dist" in version) {
            adjustTarball(version);
          }

          res.send(version);
        }
        else {
          res.send("notfound");
        }
      }
    });
  }
});

app.get('/:doc', function(req, res){
  db.get(req.params.doc, function(err, body) {
    if (!err) {
      if ("versions" in body) {
        var versions = body.versions;
        for (var k in versions) {
          if ("dist" in versions[k]) {
            adjustTarball(versions[k]);
          }
        }
      }
      res.send(body);
    }
    else {
      res.send("notfound");
    }
  });
});
