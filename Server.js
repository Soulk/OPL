var express = require("express");
var GitHubApi = require("github");
var github;
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

app.use(express.static('css'));
app.use(express.static('fonts'));
app.use(express.static('assets'));
app.use(express.static('img'));
app.use(express.static('js-main.apiGit'));
app.use(express.static('js-main'));

//ROUTES
var rLogin = require('./routes/login');
var rIndex = require('./routes/index');
var rPull = require('./routes/pullrequest');

app.use('/', rLogin);
app.use('/index.html', rIndex);
app.use('/pullrequest.html',rPull);

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


app.set("github",github);

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});


router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

app.use("/",router);
app.use("/index.html",router);
app.use("/pullrequest.html",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});


module.exports = app;
