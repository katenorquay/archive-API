var express = require('express');
var router = express.Router();
var designDB = require('../db/data')
var unirest = require('unirest')
var Urlbox = require('urlbox')
const {errorMessage, successMessage} = require('../db/responses')


const timestamps = [19990615, 20000615, 20010615, 20020615, 20030615, 20040615, 20050615, 20060615, 20070615, 20080615, 20090615, 20100615, 20110615, 20120615, 20130615, 20140615, 20150615, 20160615]
const practiceStamps = [20070615, 20080615]

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
  console.log(req.params.year)
  designDB.getDesignsByYear(req.params.year)
  .then(designs => res.json({designs}))
  .catch(err => res.status(500)
    .json(errorMessage('could not retrieve designs by year'))
  )
})

//Delete a design by id
router.post('/:id', (req, res) => {
  designDB.deleteDesignById(req.params.id)
  .then(response => res.status(200)
    .json(successMessage('design successfully deleted'))
  )
  .catch(err => res.status(500)
    .json(errorMessage('could not retrieve designs by url'))
  )
})

//Post a new url
router.post('/', (req, res) => {
  var url = String(req.body.url).replace(/^(https?:\/\/)?(www\.)?/,'')
  designDB.getDesignsByUrl(url)
  .then(designs => {
    if (designs.length !== 0){
      res.json({designs})
    } else {
      prepUrls(url, practiceStamps, waybackAPI)
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
                const urlbox = Urlbox(process.env.SCREENSHOT_KEY, process.env.SCREENSHOT_SECRET);
                const options = {
                  url: waybackUrls[i],
                  thumb_width: 600,
                  format: 'jpg',
                  quality: 80,
                  hide_selector: 'div#wm-ipp-inside'
                };
                const imgUrl = urlbox.buildUrl(options);
                console.log(imgUrl)
                screenshotUrls.push(imgUrl)
                if (screenshotUrls.length === waybackUrls.length) {
                  sliceYears(url, waybackUrls, waybackTimeStamps, screenshotUrls, makeDbObject)
                }
              }, i * 10000)
            }(i))
          }
        }
      }

      function sliceYears(url, waybackUrls, waybackTimeStamps, screenshotUrls, makeDbObject) {
        console.log('sliceYears')
        var years = []
        waybackTimeStamps.map(function (stamp) {
          years.push(stamp.slice(0, 4))
        })
        makeDbObject(url, waybackUrls, waybackTimeStamps, screenshotUrls, years)
      }


      function makeDbObject(url, waybackUrls, waybackTimeStamps, screenshotUrls, years) {
        var designObjects = []
        console.log('dbObject')
        for (var i = 0; i < years.length; i++) {
          var designObj = {
            "image_url": screenshotUrls[i],
            "page_url": url,
            "wayback_url": waybackUrls[i],
            "year": years[i],
            "timestamp": waybackTimeStamps[i]
          }
          designObjects.push(designObj)
        }
          intoDB(url, designObjects)
      }

      function intoDB(url, designObjects) {
        console.log('yahoo!', designObjects)
          designDB.addNewDesign(designObjects)
            .then(designs => designDB.getDesignsByUrl(url))
            .then(designs => res.json({designs}))
            .catch(err => res.status(500)
              .json(errorMessage('could not add url to database'))
            )
        }
      }
    })
})

module.exports = router;
