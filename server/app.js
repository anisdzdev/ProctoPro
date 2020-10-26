const express = require('express');

const app = express();
const dir = __dirname;
require('./startup/logging')();
require('./startup/routes')(app, dir);
require('./startup/db')();
require('./startup/base_config')();
require('./startup/validation')();

module.exports = app;

