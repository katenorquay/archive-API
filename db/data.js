var Knex = require('knex')
var knexConfig = require('../knexfile')[process.env.NODE_ENV || 'development']
var knex = Knex(knexConfig)

function getDesigns() {
  return knex('designs')
}

function filterByYear(year) {
  return knex('designs').where('timestamp', year)
}

function filterByName(websiteName) {
  return knex('designs').where('title', websiteName )
}


//Get Designs by the year in the db. Where year === to the year that was sent in the get request by the user.

// function addDesigns(designInfo -- the stuff that comes back from the apis){
//   return knex('designs').insert(designInfo)
// }
module.exports = {
  getDesigns: getDesigns,
  filterByYear: filterByYear,
  filterByName: filterByName
}
