var express = require('express');
var router = express.Router();
var designDB = require('../db/data')
var unirest = require('unirest')
var Urlbox = require('urlbox')
const {errorMessage, successMessage} = require('../db/responses')
var prepUrls = require('../api-functions/prepUrls')
var waybackAPI = require('../api-functions/waybackAPI')
var removeDuplicates = require('../api-functions/removeDuplicates')
var screenshotAPI = require('../api-functions/screenshotAPI')
var sliceYears = require('../api-functions/screenshotAPI')
var makeDbObject = require('../api-functions/screenshotAPI')


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
      var generatedUrls = prepUrls(url, practiceStamps)
      console.log(generatedUrls)
      waybackAPI(url, generatedUrls, function(times, links) {
        var unduplicatedUrls = removeDuplicates(links)
        var years = sliceYears(times)
        screenshotAPI(unduplicatedUrls, function(screenshotLinks) {
          var designObjs = makeDbObject(url, unduplicatedUrls, times, screenshotLinks, years)
          designObjects = designObjs.splice(0, 18)
          designDB.addNewDesign(designObjects)
            .then(designs => designDB.getDesignsByUrl(url))
            .then(designs => res.json({designs}))
            .catch(err => res.status(500)
              .json(errorMessage('could not add url to database'))
            )
        })
      })
    }
  })
})

module.exports = router;
