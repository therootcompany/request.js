'use strict';

//var request = require('@coolaj86/urequest');
// To check and make sure the outputs are the same
//var request = require('request');
var request = require('../');

// will redirect to https://www.github.com and then https://github.com
//request('http://www.github.com', function (error, response, body) {
request(
  //{ url: 'http://postb.in/syfxxnko'
  { url: 'http://localhost:3007/form-data/'
  , method: 'POST'
  , headers: { 'X-Foo': 'Bar' }
  , formData: {
      foo: 'bar'
    , baz: require('fs').createReadStream(require('path').join(__dirname, 'get-to-json.js'))
    }
  }
, function (error, response, body) {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
      return;
    }
    console.log('statusCode:', response.statusCode); // The final statusCode
    console.log('Body Length:', body.length); // body length
  }
);
