exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('designs', function(table) {
    table.increments('id').primary
    table.string('image_url')
    table.string('page_url')
    table.string('year')
    table.string('timestamp')
  });
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('designs')
};
