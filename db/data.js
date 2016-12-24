var Knex = require('knex')
var knexConfig = require('../knexfile')[process.env.NODE_ENV || 'development']
var knex = Knex(knexConfig)

function getDesigns() {
  return knex('designInfo')
}

function getDesignsByYear(year) {
  return knex('designInfo').where('year', year)
}

function getDesignsByUrl(url) {
  return knex('designInfo').where('page_url', url)
}

function addNewDesign(designObj){
  return knex('designInfo').insert(designObj)
}

function deleteDesignById(id) {
  return knex('designInfo').where('id', id).del()
}

module.exports = {
  getDesigns: getDesigns,
  getDesignsByYear: getDesignsByYear,
  getDesignsByUrl: getDesignsByUrl,
  addNewDesign: addNewDesign,
  deleteDesignById: deleteDesignById
}
