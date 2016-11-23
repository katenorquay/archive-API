var Knex = require('knex')
var knexConfig = require('../knexfile')[process.env.NODE_ENV || 'development']
var knex = Knex(knexConfig)

function getDesigns() {
  return knex('designInfo')
}

function filterByYear(year) {
  return knex('designInfo').where('year', year)
}

function filterByName(websiteName) {
  return knex('designInfo').where('page_url', websiteName )
}

function addNewDesign(){
  return knex('designInfo').insert()
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
