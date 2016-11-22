var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var unirest = require('unirest')

var timestamps = require('./functions/timestamps')
var routes = require('./routes/index');
var designs = require('./routes/designs');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/designs', designs);

getPostInfo({ body: { submitted_url: 'facebook.com',
  year: [ '2000', '2001' ],
  frequency: 'yearly',
  commit: 'Enter' }}, undefined)

function getPostInfo(req, res) {
  console.log('hit getPostInfo!')
  var submittedUrl = req.body.submitted_url
  var startPoint = req.body.year[0]
  var endPoint = req.body.year[1]
  var groupedTimeStamps = timestamps.iterateTimeStamps(startPoint, endPoint)
  prepUrls(submittedUrl, groupedTimeStamps)
}

function prepUrls(submittedUrl, groupedTimeStamps) {
  console.log('hit prepUrls!')
  var generatedUrls = []
  for (var i = 0; i < groupedTimeStamps.length; i++) {
    generatedUrls.push('http://archive.org/wayback/available?url=' + submittedUrl + '&timestamp=' + groupedTimeStamps[i])
  }
  callWaybackAPI(submittedUrl, generatedUrls)
}

function callWaybackAPI(submittedUrl, generatedUrls) {
  console.log('hit waybackAPI!')
  waybackUrls = []
  waybackTimeStamps = []
  slowDownLoop()
  function slowDownLoop() {
    for (var i = 0; i < generatedUrls.length; i++) {
      (function(i) {
        setTimeout(function() {
          unirest.get(generatedUrls[i])
            .header("X-Mashape-Key", process.env.WAYBACK_KEY)
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .end(function (result) {
              var makeObject = JSON.parse(result.body)
              var saveUrl = makeObject.archived_snapshots.closest.url
              var saveTimeStamp = makeObject.archived_snapshots.closest.timestamp
              if (waybackUrls.length < generatedUrls.length) {
                waybackUrls.push(saveUrl)
                waybackTimeStamps.push(saveTimeStamp)
                if (waybackUrls.length === generatedUrls.length) {
                  console.log(waybackUrls)
                  callScreenshotAPI(submittedUrl, waybackUrls, waybackTimeStamps)
                }
              }
            })
        }, i * 5000)
      }(i))
    }
  }
}

function callScreenshotAPI(submittedUrl, waybackUrls, waybackTimeStamps) {
  var screenshotUrls = []
  slowDownLoop()
  function slowDownLoop() {
    for (var i = 0; i <= waybackUrls.length; i++) {
      (function(i) {
        setTimeout(function() {
          unirest.get("https://thumbnail-thumbnail-v1.p.mashape.com/get?delay=2500&format=PNG&fullpage=true&url=http%3A%2F%2Fwww.twitter.com%2F&width=500")
          .header("X-Mashape-Key", "nhps9N9YQwmshJlQiNPupJjz1iCEp1KfDERjsn2SNzWt4sAoVG")
          .end(function (result) {
            console.log(result.status, result.headers, result.body);
});
          }, i * 5000)
      }(i))
    }
  }
collectAllData(submittedUrl, savedtimeStamps, screenshotUrls)
}


function collectAllData(submittedUrl, waybackTimeStamps, screenshotUrls) {
  grabbedYears = []
  for (var i = 0; i < savedtimeStamps.length; i++) {
    grabbedYears.push(savedtimeStamps[i].slice(0, 4))
  }
  makeObject(submittedUrl, waybackTimeStamps, grabbedYears, screenshotUrls)
}

//This works for getting one

function makeObject(submittedUrl, waybackTimeStamps, grabbedYears, screenshotUrls) {
  var objectArray = []
  for (var i = 0; i < savedtimeStamps.length; i++) {
    var newObj = {
    "image_url": screenshotUrls[i],
    "page_url": submittedUrl,
    "year": grabbedYears[i],
    "timestamp": waybackTimeStamps[i]
    };
    objectArray.push(newObj)
  }
  console.log(objectArray)
}

// each time the for loop goes round, I want to create a new object



module.exports = app;
