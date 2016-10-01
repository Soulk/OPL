var express = require('express');

var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');

router.get('/',function(req, res) {
    res.sendFile(path + "/login.html");
   /* document.getElementById('searchUser').onkeydown = function(e) {
        if (e.keyCode == 13) {
            getReposByUser();
            console.log("test");
        }
    };*/


});
router.get('/login.html/validate',function(req, res) {

     req.app.get('github').authenticate({
        type: "basic",
        username: req.query.username,
        password: req.query.password
    });
    req.app.get('github').users.get({}, function(err, res) {
        console.log(JSON.stringify(res));

    });
   // res.sendFile(path + "/login.html");


});

module.exports = router;