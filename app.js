var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var unirest = require('unirest')
var Urlbox = require('urlbox')
const urlbox = Urlbox("bb37accb-ed39-4cbf-a531-f0645a4db833", "eb75d5a4-05b9-401f-91f5-d951d7b0fa89")

var makeObject = require('./makeObject')
var timestamps = require('./timestamps')
var routes = require('./routes/index');
var designs = require('./routes/designs');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/designs', designs);

getPostInfo({ body: { submitted_url: 'facebook.com',
  year: [ '2002', '2003' ],
  frequency: 'yearly',
  commit: 'Enter' }}, undefined)

function getPostInfo(req, res) {
  console.log('PostInfo!')
  var submittedUrl = req.body.submitted_url
  var startPoint = req.body.year[0]
  var endPoint = req.body.year[1]
  var groupedTimeStamps = timestamps.iterateTimeStamps(startPoint, endPoint)
  prepUrls(submittedUrl, groupedTimeStamps)
}

function prepUrls(submittedUrl, groupedTimeStamps) {
  console.log('prepUrls')
  var generatedUrls = []
  for (var i = 0; i < groupedTimeStamps.length; i++) {
    generatedUrls.push('http://archive.org/wayback/available?url=' + submittedUrl + '&timestamp=' + groupedTimeStamps[i])
  }
  callWaybackAPI(submittedUrl, generatedUrls)
}

function callWaybackAPI(submittedUrl, generatedUrls) {
  console.log('callWaybackAPI')
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
  console.log('screenshotAPI')
  var screenshotUrls = []
    for (var i = 0; i <= waybackUrls.length - 1; i++) {
          var options = {
            url: waybackUrls[i],
            thumb_width: 600,
            format: 'jpg',
            quality: 100
          };
          const imgUrl = urlbox.buildUrl(options)
          if (screenshotUrls.length < waybackUrls.length) {
            screenshotUrls.push(imgUrl)
          }
    }
    callImgurAPI(submittedUrl, waybackTimeStamps, screenshotUrls)
}

function callImgurAPI(submittedUrl, waybackTimeStamps, screenshotUrls) {
  console.log('Made it to imgur!')
  var realUrls = []
  for (var i = 0; i <= screenshotUrls.length - 1; i++) {
    unirest.post('https://imgur-apiv3.p.mashape.com/3/image')
    .header("X-Mashape-Key", process.env.IMGUR_KEY)
    .header("Authorization", "Client-ID process.env.IMGUR_CLIENT_ID")
    .attach("image", screenshotUrls[i])
    .end(function (result) {
      var realUrl = result.body.data.link
      if (realUrls.length < screenshotUrls.length) {
        realUrls.push(realUrl)
        if(realUrls.length === screenshotUrls.length) {
          collectAllData(submittedUrl, waybackTimeStamps, realUrls)
        }
      }
    });
  }
}

function collectAllData(submittedUrl, waybackTimeStamps, realUrls) {
  grabbedYears = []
  for (var i = 0; i < waybackTimeStamps.length; i++) {
    grabbedYears.push(waybackTimeStamps[i].slice(0, 4))
  }
  makeObject(submittedUrl, waybackTimeStamps, grabbedYears, realUrls)
}


//Questions
//How to put the object i've created into a database. Will this work?
//How to get post info to the rest of the code
//deploying


module.exports = app;
