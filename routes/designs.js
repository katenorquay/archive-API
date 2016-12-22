var express = require('express');
var router = express.Router();
var designDB = require('../db/data')
var unirest = require('unirest')
const {prepUrls, waybackAPI, makeDbObject} = require('../apiCalls')

const timestamps = [19960615, 19970615, 19980615, 19990615, 20000615, 20010615, 20020615, 20030615, 20040615, 20050615, 20060615, 20070615, 20080615, 20090615, 20100615, 20110615, 20120615, 20130615, 20140615, 20150615, 20160615]
const practiceStamps = [20100615, 20110615]

//Gets all the designs
router.get('/', (req, res) => {
  designDB.getDesigns()
  .then(designs => res.json({designs}))
  .catch(err => res.status(500)
    .json(errorMessage('could not retrieve all designs'))
  )
})

//Gets designs by year
router.get('/year', (req, res) => {
  designDB.getDesignsByYear(req.headers.year)
  .then(year => res.json({year}))
  .catch(err => res.status(500)
    .json(errorMessage('could not retrieve designs by year'))
  )
})

//Get designs by website name
router.get('/url', (req, res) => {
  var url = String(req.headers.url).replace(/^(https?:\/\/)?(www\.)?/,'')
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
    prepUrls (url, practiceStamps, waybackAPI)
    }
  })
})

// designDB.addNewDesign()
// .then(design => res.json({design}))
// .catch(err => res.status(500))


module.exports = router;
