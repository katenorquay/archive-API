var request = require('supertest');
var app = require('../app');
var test = require('tape');

test('test setup working', function(t) {
  t.pass()
  t.end()
})

test('api/v1/designs can get all the designs', function(t) {
  request(app)
    .get('/api/v1/designs')
    .expect(200)
    .end((err, res) => {
      t.false(err, 'The error from /designs is null (falsey)')
      t.true(res, 'The response from /designs is truthy')
      t.true(typeof res.body === 'object', '/designs returns an array of objects')
      t.end()
    })
})

test('/:year can get designs by year', function(t) {
  request(app)
  .get('/api/v1/designs/2000')
  .expect(200)
  .end((err, res) => {
    t.false(err, 'The error from /:year is null (falsey)')
    t.true(res, 'The response from /:year is truthy')
    t.true(typeof res.body === 'object', '/:year returns an array of objects')
    console.log(res.body)
    t.true(res.body.designs[0].year === '2000', ':/year returns the correct year')
  })
})
