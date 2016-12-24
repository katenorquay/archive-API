var express = require('express');
var router = express.Router();
var designDB = require('../db/data')
var unirest = require('unirest')
const {prepUrls, waybackAPI, makeDbObject} = require('../apiCalls')
const errorMessage = require('../db/errorMessage')


const timestamps = [19980615, 19990615, 20000615, 20010615, 20020615, 20030615, 20040615, 20050615, 20060615, 20070615, 20080615, 20090615, 20100615, 20110615, 20120615, 20130615, 20140615, 20150615, 20160615]
const practiceStamps = [20100615]

//Gets all the designs
router.get('/', (req, res) => {
  designDB.getDesigns()
  .then(designs => res.json({designs}))
  .catch(err => res.status(500)
    .json(errorMessage('could not retrieve all designs'))
  )
})

//Gets designs by year
router.get('/:year', (req, res) => {
  designDB.getDesignsByYear(req.params.year)
  .then(year => res.json({year}))
  .catch(err => res.status(500)
    .json(errorMessage('could not retrieve designs by year'))
  )
})

//Get designs by website name
router.get('/url/:url', (req, res) => {
  var url = String(req.params.url).replace(/^(https?:\/\/)?(www\.)?/,'')
  designDB.getDesignsByUrl(url)
  .then(url => res.json({url}))
  .catch(err => res.status(500)
    .json(errorMessage('could not retrieve designs by url'))
  )
})

router.post('/', (req, res) => {
  var url = String(req.body.url).replace(/^(https?:\/\/)?(www\.)?/,'')
  designDB.getDesignsByUrl(url)
  .then(pageName => {
    if (pageName.length !== 0){
      res.json({pageName})
    } else {
      prepUrls(url, timestamps, waybackAPI)
      function prepUrls (url, timestamps, waybackAPI) {
        console.log('prepUrls');
        var generatedUrls = []
        timestamps.map(function (stamp) {
        generatedUrls.push('http://archive.org/wayback/available?url=' + url + '&timestamp=' + stamp)
        })
         waybackAPI(url, generatedUrls, practiceStamps, screenshotAPI)
      }

      function waybackAPI(url, generatedUrls, practiceStamps, screenshotAPI) {
        console.log('waybackAPI');
        waybackUrls = []
        waybackTimeStamps = []
        slowDownLoop()
        function slowDownLoop() {
          for (var i = 0; i < generatedUrls.length; i++) {
            (function(i) {
              setTimeout(function() {
                unirest.get(generatedUrls[i])
                  .header("X-Mashape-Key", process.env.MASHAPE_KEY)
                  .header("Content-Type", "application/json")
                  .header("Accept", "application/json")
                  .end(function (result, error) {
                    if (error) console.log(error)
                    console.log(result.body)
                    var obj = JSON.parse(result.body)
                    var saveUrl = obj.archived_snapshots.closest.url
                    var saveTimeStamp = obj.archived_snapshots.closest.timestamp
                      waybackUrls.push(saveUrl)
                      waybackTimeStamps.push(saveTimeStamp)
                      if (waybackUrls.length === generatedUrls.length) {
                      screenshotAPI(url, waybackUrls, waybackTimeStamps, sliceYears)
                    }
                  })
              }, i * 7000)
            }(i))
          }
        }
      }

      function screenshotAPI(url, waybackUrls, waybackTimeStamps, sliceYears) {
        console.log('screenshotAPI')
          var screenshotUrls = []
          slowDownLoop()
          function slowDownLoop() {
            for (var i = 0; i <= waybackUrls.length - 1; i++) {
              (function (i) {
                setTimeout(function() {
                  unirest.get("https://browshot.p.mashape.com/screenshot/create?key=" + process.env.SCREENSHOT_KEY + "&size=screen&url=" + waybackUrls[i])
                  .header("X-Mashape-Key", process.env.MASHAPE_KEY)
                  .header("Accept", "application/json")
                  .end(function (result) {
                    console.log(result.body)
                    var screenshot_url = result.body.screenshot_url
                    screenshotUrls.push(screenshot_url)
                    if (screenshotUrls.length === waybackUrls.length) {
                     sliceYears(url, waybackTimeStamps, screenshotUrls, makeDbObject)
                    }
                  })
                }, i * 10000)
              }(i))
            }

          }
        }

      function sliceYears(url, waybackTimeStamps, screenshotUrls, makeDbObject) {
        console.log('sliceYears')
        var years = []
        waybackTimeStamps.map(function (stamp) {
          years.push(stamp.slice(0, 4))
        })
        makeDbObject(url, waybackTimeStamps, screenshotUrls, years)
      }


      function makeDbObject(url, waybackTimeStamps, screenshotUrls, years) {
        var designObjects = []
        console.log('dbObject')
        for (var i = 0; i < years.length; i++) {
          var designObj = {
            "image_url": screenshotUrls[i],
            "page_url": url,
            "year": years[i],
            "timestamp": waybackTimeStamps[i]
          }
          designObjects.push(designObj)
        }
        intoDB(designObjects)
      }

      function intoDB(designObjects) {
        console.log('yahoo!', designObjects)
        for(var i = 0; i < designObjects.length; i++) {
          designDB.addNewDesign(designObjects[i])
          .then(design => {
            res.json({design})
          })
          .catch(err => res.status(500)
            .json(errorMessage('could not add url to database'))
            )
          }
        }
      }
    })
})



module.exports = router;
