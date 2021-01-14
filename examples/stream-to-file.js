'use strict';

var request = require('../');

async function main() {
    var tpath = '/tmp/google-index.html';
    var resp = await request({
        url: 'https://google.com',
        encoding: null,
        stream: tpath
    });
    console.log('[Response Headers]');
    console.log(resp.toJSON().headers);

    //console.error(resp.headers, resp.body.byteLength);
    await resp.stream;
    console.log('[Response Body] written to', tpath);
}

main()
    .then(function () {
        console.log('Pass');
    })
    .catch(function (e) {
        console.error('Fail');
        console.error(e.stack);
    });
