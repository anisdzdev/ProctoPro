const https = require('https');
const querystring = require('querystring');
const config = require('config');

const base_url = 'api.typingdna.com';
const apiKey = config.get('apiKey');
const apiSecret = config.get('apiSecret');


module.exports = function (req, res, next) {
    const id = req.user._id;
    const data = {
        tp: req.body.tp_2,
    };
    const options = {
        hostname: base_url,
        port: 443,
        path: '/save/' + id,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            'Authorization': 'Basic ' + new Buffer(apiKey + ':' + apiSecret).toString('base64'),
        },
    };
    let responseData = '';
    const request = https.request(options, function (res) {
        res.on('data', function (chunk) {
            responseData += chunk;
        });

        res.on('end', function () {
            console.log(JSON.parse(responseData));
            next();
        });
    });

    request.on('error', function (e) {
        console.error(e);
        return res.status(401).send('Something went wrong with the typing_dna api.')
    });
    request.write(
        querystring.stringify(data)
    );
    request.end();
}