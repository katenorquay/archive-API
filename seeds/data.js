exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('designs').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('designs').insert({id: 1, url:'https://pbs.twimg.com/profile_images/791038006220115968/Rn3F352i.jpg', title:'Lettuce', timestamp:2000}),

        knex('designs').insert({id: 2, url:'http://weknowyourdreams.com/images/cat/cat-02.jpg', title:'Lettuce', timestamp:2000}),
        
        knex('designs').insert({id: 3, url:'http://www.visawoap.com/site/uploads/2016/05/Pravda-Restaurant-Cafe_Hero-1024x680.jpg', title:'Something', timestamp:2001})
      ]);
    });
};
