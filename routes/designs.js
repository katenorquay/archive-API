var express = require('express');
var router = express.Router();
var designDB = require('../db/data')
var unirest = require('unirest')

//Gets all the designs
router.get('/', function(req, res) {
  designDB.getDesigns()
    .then(function(designs){
      res.json({designs}).status(200)
    })
    .catch(function(err){
      console.log(err);
      res.status(500)
    })
});

//Gets designs by year
router.get('/:year', function(req, res) {
  console.log(req.params.filter)
  designDB.filterByYear(req.params.year)
  .then(function(year){
    res.json({year}).status(200)
  })
  .catch(function(err){
    console.log(err)
    res.status(500)
  })
})

//Get designs by website name
router.get('/url/:websiteURL', function(req, res) {
  console.log(req.params.websiteURL)
  designDB.filterByName(req.params.websiteURL)
  .then(function(websiteURL){
    res.json({websiteURL}).status(200)
  })
  .catch(function(err){
    console.log(err)
    res.status(500)
  })
})

// router.post('/generate', function(req, res) {
//   logic.getPostInfo(req, res)
// })



// router.post('/', function(req, res){
//   foodDB.addDesigns(req.body)
//     .then(function(designInfo){
//       console.log(designInfo);
//       res.json({designInfo}).status(201)
//     })
//     .catch(function(err){
//       res.status(404)
//     })
// })

// router.post('/', function(req, res) {
//   var newCat = req.body
//   var keys = Object.keys(req.body)
//
//   if (!keys.includes('id') || !keys.includes('name')) {
//     res.status(400)
//   } else {
//     res.status(201)
//     cats.push(newCat)
//   }
//
//   res.json(newCat)
// })


module.exports = router;
