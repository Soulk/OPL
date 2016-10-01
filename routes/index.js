var express = require('express');

var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');


router.get('/',function(req, res) {
    //res.setHeader("Content-Type", 'text/css');

        /*if(github == null) {

        }

        req.app.get('github').users.getFollowingForUser({
            // optional:
            // headers: {
            //     "cookie": "blahblah"
            // },
            user: "wadinj"
        }, function(err, res) {
            console.log(JSON.stringify(res));

        });*/
            res.sendFile(path + "/index.html");

});

/*router.get('/index.html/:user',function(req, res) {
    github.search.users({
        // optional:
        // headers: {
        //     "cookie": "blahblah"
        // },
        q: req.params.user
    }, function(err, res) {
        console.log(JSON.stringify(res));
    });
});*/

router.get('/pullrequest.html',function(req, res) {
    res.sendFile(path + "/pullrequest.html");
});

router.get('/user.html',function(req, res) {
    res.sendFile(path + "/user.html");
});

module.exports = router;