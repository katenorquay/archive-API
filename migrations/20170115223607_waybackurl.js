exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('designInfo', function(table) {
    table.increments('id').primary
    table.string('image_url')
    table.string('page_url')
    table.string('wayback_url')
    table.string('year')
    table.string('timestamp')
  });
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('designInfo')
};
