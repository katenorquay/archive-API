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
        var generatedUrls = []
        timestamps.map(function (stamp) {
        generatedUrls.push('http://archive.org/wayback/available?url=' + url + '&timestamp=' + stamp)
        })
        console.log(generatedUrls)
         waybackAPI(url, generatedUrls, practiceStamps, screenshotAPI)
      }

      function waybackAPI(url, generatedUrls, practiceStamps, screenshotAPI) {
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
                    var obj = JSON.parse(result.body)
                    var saveUrl = obj.archived_snapshots.closest.url
                    var saveTimeStamp = obj.archived_snapshots.closest.timestamp
                      waybackUrls.push(saveUrl)
                      waybackTimeStamps.push(saveTimeStamp)
                      if (waybackUrls.length === generatedUrls.length) {
                        console.log(waybackUrls)
                        return waybackUrls
                      removeDuplicates(url, waybackUrls, waybackTimeStamps, sliceYears)
                    }
                  })
              }, i * 3000)
            }(i))
          }
        }
      }

      function removeDuplicates(url, waybackUrls, waybackTimeStamps, sliceYears) {
        var unduplicatedUrls = waybackUrls.filter(function (item, position) {
            return waybackUrls.indexOf(item) == position;
          })
          console.log(unduplicatedUrls)
        screenshotAPI(url, unduplicatedUrls, waybackTimeStamps, sliceYears)
      }



      function screenshotAPI(url, unduplicatedUrls, waybackTimeStamps, sliceYears) {
        var screenshotUrls = []
        slowDownLoop()
        function slowDownLoop() {
          for (var i = 0; i <= unduplicatedUrls.length - 1; i++) {
            (function (i) {
              setTimeout(function() {
                const urlbox = Urlbox(process.env.SCREENSHOT_KEY, process.env.SCREENSHOT_SECRET);
                const options = {
                  url: unduplicatedUrls[i],
                  thumb_width: 600,
                  format: 'jpg',
                  quality: 80,
                  hide_selector: 'div#wm-ipp-inside'
                };
                const imgUrl = urlbox.buildUrl(options);
                screenshotUrls.push(imgUrl)
                console.log(screenshotUrls)
                if (screenshotUrls.length === unduplicatedUrls.length) {
                  sliceYears(url, unduplicatedUrls, waybackTimeStamps, screenshotUrls, makeDbObject)
                }
              }, i * 7000)
            }(i))
          }
        }
      }

      function sliceYears(url, unduplicatedUrls, waybackTimeStamps, screenshotUrls, makeDbObject) {
        var years = []
        waybackTimeStamps.map(function (stamp) {
          years.push(stamp.slice(0, 4))
        })
        makeDbObject(url, unduplicatedUrls, waybackTimeStamps, screenshotUrls, years)
      }


      function makeDbObject(url, unduplicatedUrls, waybackTimeStamps, screenshotUrls, years) {
        var designObjects = []
        for (var i = 0; i < years.length; i++) {
          var designObj = {
            "image_url": screenshotUrls[i],
            "page_url": url,
            "wayback_url": unduplicatedUrls[i],
            "year": years[i],
            "timestamp": waybackTimeStamps[i]
          }
          designObjects.push(designObj)
        }
          intoDB(url, designObjects)
      }

      function intoDB(url, designObjects) {
        designObjects = designObjects.splice(0, 18)
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


// function callback() {
//   var generatedUrls = prepUrls(url, timestamps) {
//     waybackAPI(url, generatedUrls, practiceStamps, screenshotAPI) {
//       if (waybackUrls.length === generatedUrls.length) {
//         removeDuplicates(url, waybackUrls, waybackTimeStamps, sliceYears)
//     }
//
//     }
//   }
// }
