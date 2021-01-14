'use strict';

var request = require('../');
request({
    url: 'https://postb.in/1588134650162-6019286897499?hello=world'
    //headers: { 'user-agent': false } // remove
    //headers: { 'user-agent': 'test/1.0' } // overwrite
    //userAgent: 'test/1.1' // add to the default
})
    .then(function (resp) {
        console.log(resp.body);
    })
    .catch(function (err) {
        console.error(err);
    });
