var express = require('express');
var GitHubApi = require("github");
var app = express();
var router = express.Router();
var pathModule = require("path");
var path = pathModule.resolve(__dirname, '../views');
var github;

router.get('/',function(req, res) {
    //res.setHeader("Content-Type", 'text/css');

        if(github == null) {
            github = new GitHubApi({
                // optional args
                debug: true,
                protocol: "https",
                host: "api.github.com", // should be api.github.com for GitHub
                pathPrefix: "", // for some GHEs; none for GitHub
                headers: {
                    "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
                },
                Promise: require('bluebird'),
                followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
                timeout: 5000
            });

            // TODO: optional authentication here depending on desired endpoints. See below in README.
            github.authenticate({
                type: "basic",
                username: "fakeNoob",
                password: "lolilol97"
            });
        }

        github.users.getFollowingForUser({
            // optional:
            // headers: {
            //     "cookie": "blahblah"
            // },
            user: "wadinj"
        }, function(err, res) {
            console.log(JSON.stringify(res));

        });
            res.sendFile(path + "/index.html");

});

router.get('/pullrequest.html',function(req, res) {
    res.sendFile(path + "/pullrequest.html");
});

router.get('/user.html',function(req, res) {
    res.sendFile(path + "/user.html");
});

module.exports = router;