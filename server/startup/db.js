const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        .then(() => winston.info(`Connected to ${db}...`))
        .catch(err => winston.error('Could not connect to MongoDB...'));
}