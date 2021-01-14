'use strict';

var request = require('../');

async function main() {
    var tpath = '/tmp/google-index.html';
    var resp = await request({
        url: 'https://google.com',
        encoding: null,
        stream: true
    });
    console.log('[Response Headers]');
    console.log(resp.toJSON().headers);

    resp.on('data', function (chunk) {
	    console.log('[Data]', chunk.byteLength);
    });
    resp.on('end', function (chunk) {
	    console.log('[End]');
    });

    //console.error(resp.headers, resp.body.byteLength);
    await resp.stream;
    console.log('[Close]');
}

main()
    .then(function () {
        console.log('Pass');
    })
    .catch(function (e) {
        console.error('Fail');
        console.error(e.stack);
    });
