var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const cors = require('cors')
// const corsOptions = {
//   origin: true,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   credentials: false
// }
require('dotenv').config();


var routes = require('./routes/index');
var designs = require('./routes/designs');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/designs', designs)

module.exports = app;
