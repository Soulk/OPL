var express = require('express');

var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');


router.get('/',function(req, ser) {
        req.app.get('github').repos.getAll({
            sort : "updated"
        }, function(err, res) {
            console.log("\n\nazeakejkaze kAJHJAZHJHJHJZRH JZRJKHZJR HHRJHZ JKZHRJKHZRJHZKRHZJRKZRHJHZR JZRKHZRJR");
            console.log(res[1]);
            ser.render("index.ejs",{
                res : res
            });

        });

            //res.sendFile(path + "/index.html");

});


router.get('/user.html',function(req, res) {
    res.sendFile(path + "/user.html");
});

module.exports = router;