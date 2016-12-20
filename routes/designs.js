var express = require('express');
var router = express.Router();
var designDB = require('../db/data')
var unirest = require('unirest')

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

    }
  })
})


module.exports = router;
