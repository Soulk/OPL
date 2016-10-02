var express = require('express');

var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');

router.get('/',function(req, ser) {
     console.log("pullrequest");
     console.log(req.query.owner);
     console.log(req.query.repo);
     ser.app.get('github').pullRequests.getAll({
         user: req.query.owner,
         repo: req.query.repo,
        //user: "foretagsplatsen",
        //repo: "numbro",
        state: "all",
        per_page: 100
     }, function(err, res) {
         //console.log(res);
         var arrayUser=[];
         //console.log(res.length);
         for(var i=0; i<res.length; i++) {
         //console.log(res[i].user.login);
            var isAlready = false;
            for(var j = 0 ; j <arrayUser.length; j++) {
                if(res[i].user.login == arrayUser[j]) {
                    isAlready = true;
                }
            }
            if(!isAlready) {
                arrayUser.push(res[i].user.login);
            }
         }
         for(var i=0; i<arrayUser.length;i++) {
            var good = 0;
            var bad = 0;
            for(var j=0; j<res.length; j++) {
                if(res[j].user.login == arrayUser[i]) {
                    if(res[j].merged_at == null && res[j].closed_at != null) {
                        bad++;
                        // console.log(res[j].user.login +" BAD");
                    } else if(res[j].closed_at != null) {
                        good++;
                    }
                }
            }
            //console.log("BAD = " + bad + " GOOD = " + good);
            if(bad == 0 && good == 0) {
                arrayUser[i] = { name: arrayUser[i], ratio:  "new", total: "new"};
            } else {
                arrayUser[i] = { name: arrayUser[i], ratio:  Math.floor((good/(good+bad))*100), total: good+bad};
            }
         }
         var pullRequests = [];
         for(var i=0; i<res.length; i++) {
            //console.log(res[i].state);
            if(res[i].state == 'open') {
                for(var j = 0; j<arrayUser.length;j++) {
                    //console.log(res[i].user.login+" " + arrayUser[j].name);
                    if(res[i].user.login == arrayUser[j].name) {
                        res[i].user.login = arrayUser[j];

                        break;
                    }
                }
                pullRequests.push(res[i]);
            }
         }
         //console.log(arrayUser);
         console.log(pullRequests);
         console.log(req);
         ser.render("pullrequest.ejs",{
             res : pullRequests,
             req : req
         });

     });


});

module.exports = router;