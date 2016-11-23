exports.seed = function(knex, Promise) {

  return knex('designs').del()
    .then(function () {
      return Promise.all([
        knex('designInfo').insert({image_url:'http://i.imgur.com/hNiKI9F.jpg', page_url:'facebook.com', year:'2000', timestamp:'20000915172800'}),

        knex('designInfo').insert({ image_url:'http://i.imgur.com/8DPUJ4R.jpg', page_url:'facebook.com',
        year:'2001', timestamp:'20010517235729'})
      ]);
    });
};
