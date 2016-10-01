var express = require('express');

var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');

router.get('/',function(req, res) {
    res.sendFile(path + "/pullrequest.html");
     console.log("pullrequest");
     console.log(req.query.owner);
     console.log(req.query.repo);
     req.app.get('github').pullRequests.getAll({
        // user: req.query.owner,
        // repo: req.query.repo
        user: "foretagsplatsen",
        repo: "numbro",
        state: "closed"
     }, function(err, res) {
         console.log(res);
     });


});

module.exports = router;