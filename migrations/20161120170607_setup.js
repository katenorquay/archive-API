
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('designs', function(table) {
    table.increments('id').primary
    table.string('url')
    table.string('title')
    table.integer('timestamp')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('designs')
};
