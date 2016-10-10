var express = require('express');

var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');

var tabPullRequests;
var tabPullStats;

router.get('/',function(req, ser) {
    tabPullRequests = [];
    tabPullStats = [];
     console.log("pullrequest");
     console.log(req.query.owner);
     console.log(req.query.repo);
     ser.app.get('github').pullRequests.getAll({
         user: req.query.owner,
         owner :req.query.owner,
          repo: req.query.repo,
        // user: "mozilla-mobile",
        //owner: "mozilla-mobile",
        //repo: "firefox-ios",
        state: "all",
        per_page: 100
     }, renderTab);

     function renderTab(err, res) {

              if (err) {
                  ser.redirect("/index.html");
                  return false;
              }

              tabPullRequests = tabPullRequests.concat(res);
              if (ser.app.get('github').hasNextPage(res)) {
                  ser.app.get('github').getNextPage(res, renderTab)
              } else {
                    //console.log(res);
                    var arrayUser=[];
                    //console.log(tabPullRequests.length);
                    getAllContributors(tabPullRequests, arrayUser);
                    defineRatioContributors(arrayUser,tabPullRequests);

                    var pullRequests = [];
                    createRenderedPullRequests(tabPullRequests, arrayUser, pullRequests);
                    console.log(req.query.owner);
                  console.log(req.query.repo);

                    ser.app.get('github').repos.getStatsContributors({
                             user: req.query.owner,
                             repo: req.query.repo,
                             owner: req.query.owner,
                            //user: "mozilla-mobile",
                            //owner: "mozilla-mobile",
                            //repo: req.query.repo,
                            //repo: "firefox-ios",
                            per_page: 100
                         }, statsPulls);

                         function statsPulls (err, res) {
                         if (err) {
                           ser.redirect("/index.html");
                           return false;
                         }

                         tabPullStats = tabPullStats.concat(res);
                         if (ser.app.get('github').hasNextPage(res)) {
                              ser.app.get('github').getNextPage(res, renderTab)
                         } else {
                                    console.log(pullRequests);
                                   for(var i=0;i<pullRequests.length;i++) {
                                       for(var j=0;j<tabPullStats.length;j++) {
                                       console.log(tabPullStats[j].author.login + " " + pullRequests[i].user.login.name);
                                           if(pullRequests[i].user.login.name == tabPullStats[j].author.login) {
                                               var add=0;
                                               var del=0;
                                               for(var k=0;k<tabPullStats[j].weeks.length;k++) {
                                                    add+= tabPullStats[j].weeks[k].a;
                                                    del+= tabPullStats[j].weeks[k].d;
                                               }
                                               pullRequests[i].user.login.totalAddDel = add-del;
                                           }
                                       }
                                   }
                               }
                           function generateScore(pullRequests) {
                                var maxTotalAddDel = 0;
                                var maxRatio = 0
                                var maxPullsRequestsDone = 0;
                                var oldestUpdate = new Date().getTime();
                                for(var i=0;i<pullRequests.length;i++) {
                                    if(pullRequests[i].user.login.totalAddDel == undefined) {
                                    } else if(pullRequests[i].user.login.totalAddDel > maxTotalAddDel) {
                                        maxTotalAddDel = pullRequests[i].user.login.totalAddDel;
                                    }
                                    if(pullRequests[i].user.login.ratio =="new") {

                                    } else if(pullRequests[i].user.login.ratio > maxRatio) {
                                        maxRatio = pullRequests[i].user.login.ratio;
                                    }
                                    if(pullRequests[i].user.login.ratio =="new") {

                                    } else if(pullRequests[i].user.login.total>maxPullsRequestsDone) {
                                        maxPullsRequestsDone = pullRequests[i].user.login.total;
                                    }
                                    if( (new Date(pullRequests[i].updated_at.substring(0,10)).getTime() < new Date(oldestUpdate).getTime())) {
                                        oldestUpdate = new Date(pullRequests[i].updated_at.substring(0,10)).getTime();
                                    }
                                }
                                console.log(maxTotalAddDel +" " + maxRatio +" " + maxPullsRequestsDone + " " + oldestUpdate);
                                for(var i=0;i<pullRequests.length;i++) {

                                    pullRequests[i].score = ((maxTotalAddDel == 0 ? 0 :((pullRequests[i].user.login.totalAddDel == undefined || pullRequests[i].user.login.totalAddDel<0 ? 0 : pullRequests[i].user.login.totalAddDel )/maxTotalAddDel)*30) + (maxRatio == 0 ? 0 : ((pullRequests[i].user.login.ratio =="new"? 0 : pullRequests[i].user.login.ratio) /maxRatio)*40) + (maxPullsRequestsDone == 0 ? 0 : ((pullRequests[i].user.login.total =="new"? 0 : pullRequests[i].user.login.total)/maxPullsRequestsDone)*10) + (oldestUpdate/new Date(pullRequests[i].updated_at.substring(0,10)).getTime())*20).toFixed(2);
                                }

                           };
                           generateScore(pullRequests);
                           //console.log(arrayUser);
                           //console.log(pullRequests);
                           ser.render("pullrequest.ejs",{
                               res : pullRequests,
                               req : req
                           });
                         };


              }


              function getAllContributors(res, arrayUser) {
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
              };

              function defineRatioContributors(arrayUser, res) {
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
              };

              function createRenderedPullRequests(res, arrayUser, pullRequests) {
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
              };

          };


});

module.exports = router;