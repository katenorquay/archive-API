var request = require('supertest');
var app = require('../app');
var test = require('tape');

test('test setup working', function(t) {
  t.pass()
  t.end()
})

test('get status code 200 from api/v1/designs', function(t) {
  request(app)
    .get('api/v1/designs')
    .expect(200)
    .end(function(err, res) {
      t.false(err)
      t.end()
    })
})
//
// test('get /v1/cats returns an objects with the property "cats"', function(t) {
//   request(app)
//     .get('/v1/cats')
//     .expect(200)
//     .end(function(err, res) {
//       t.false(err)
//       t.true(res.body.hasOwnProperty('cats'))
//       t.end()
//     })
// })
//
// test('get /v1/cats list contains an object with a name field', function(t) {
//   request(app)
//     .get('/v1/cats')
//     .expect(200)
//     .end(function(err, res) {
//       t.false(err, "there is no error")
//       t.equal(res.body.cats[0].name, "piet", "First cat's name is Piet")
//       t.end()
//     })
// })
//
// test('get /v1/cats list contains 2 cats', function(t) {
//   request(app)
//     .get('/v1/cats')
//     .expect(200)
//     .end(function(err, res) {
//       t.false(err, "there is no error")
//       t.equal(res.body.cats.length, 2, "cats array has a length of 2")
//       t.end()
//     })
// })
//
// //create cat
// test('post v1/cats status 201', function(t) {
//   var expected = {"id": 3, "name": "Cat-a-rine"}
//   request(app)
//     .post('/v1/cats')
//     .send(expected)
//     .expect(201)
//     .end(function(err, res) {
//       t.false(err)
//       t.end()
//     })
// })
//
// test('post v1/cats adds 4th cat', function(t) {
//   var expected = {"id": 4, "name": "Fourcat"}
//   request(app)
//     .post('/v1/cats')
//     .send(expected)
//     .expect(201)
//     .end(function(err, res) {
//       t.false(err)
//       t.deepEqual(res.body, expected)
//       t.end()
//     })
// })
//
// test('post v1/cats cat without name', function(t) {
//   var expected = {"id": 3}
//   request(app)
//     .post('/v1/cats')
//     .send(expected)
//     .expect(400)
//     .end(function(err,res) {
//       t.false(err)
//       t.end()
//     })
// })
