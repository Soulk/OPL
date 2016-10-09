var express = require('express');

var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');


router.get('/',function(req, ser) {
        req.app.get('github').repos.getAll({
            sort : "updated"
        }, function(err, response) {
            console.log("\n\nazeakejkaze kAJHJAZHJHJHJZRH JZRJKHZJR HHRJHZ JKZHRJKHZRJHZKRHZJRKZRHJHZR JZRKHZRJR");
            console.log(response);
           //console.log(response.length);
           var lock = 0;
           var arrayPull = [];
            for(var i = 0 ;i< response.length; i++) {
                var tmp = lock;
                ser.app.get('github').pullRequests.getAll({
                    user: response[i].owner.login,
                    repo: response[i].name,
                    state: "open",
                    per_page: 100
                 }, function(err, res) {
                    lock++;
                    console.log(res+" " + i);
                    //c onsole.log(response[tmp]);
                    arrayPull.push(res);
                    if(lock == response.length) {
                    //console.log(arrayPull);
                    for(var j=0 ; j<response.length;j++) {
                        for(var k =0;k<arrayPull.length;k++) {
                            //console.log(arrayPull[k][0]);
                            if(arrayPull[k][0] != undefined) {
                                 console.log(arrayPull[k][0].html_url +" " + response[j].html_url );
                                if( arrayPull[k][0].html_url.indexOf(response[j].html_url) != -1) {
                                    console.log(arrayPull[k].length);
                                    response[j].id = {id: response[j].id , nbpulls: arrayPull[k].length};
                                    k = arrayPull.length+1;
                                    break;
                                }
                            } else {
                                response[j].id = {id: response[j].id , nbpulls: 0};
                            }
                        }
                    }
                        //console.log(response);
                        ser.render("index.ejs",{
                            res : response
                        });
                    }
                 });

            }
        });

            //res.sendFile(path + "/index.html");

});

router.get('/user.html',function(req, res) {
    res.sendFile(path + "/user.html");
});

module.exports = router;