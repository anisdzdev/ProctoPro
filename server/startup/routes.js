const express = require('express');
const users = require('../routes/users');
const exams = require('../routes/exams');
const submissions = require('../routes/submissions')
const error = require('../middleware/error');
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config.dev';

const path = require('path');


module.exports = function (app, dir) {
    app.set('views', path.join(dir, 'views'));
    app.set('view engine', 'jade');
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/exams', exams);
    app.use('/api/submissions', submissions);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(express.static(path.join(dir, '/public')));
    app.use(error);
    app.use('/api/exam_files', auth, express.static(dir + '/exams'));
    app.use('/api/submissions', auth, express.static(dir + '/submissions'));
    const compiler = webpack(webpackConfig);

    app.use(webpackMiddleware(compiler, {
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }));
    app.use(webpackHotMiddleware(compiler));
    app.use(function (err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
}