const https = require('https');
const config = require('config');

const base_url = 'api.typingdna.com';
const apiKey = config.get('apiKey');
const apiSecret = config.get('apiSecret');


module.exports = function (req, res, next) {
    const id = req.user._id;

    const options = {
        hostname: base_url,
        port: 443,
        path: '/user/' + id,
        method: 'DELETE',
        headers: {
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
            const parsed = JSON.parse(responseData);
            console.log(parsed);
            next();
        });
    });

    request.on('error', function (e) {
        console.error(e);
        return res.status(401).send('Something went wrong with the typing_dna api.')
    });
    request.end();
}