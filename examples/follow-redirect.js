'use strict';

//var request = require('urequest');
var request = require('../');

// will redirect to https://www.github.com and then https://github.com
request('http://www.github.com', function (error, response, body) {
  if (error) {
    console.log('error:', error); // Print the error if one occurred
    return;
  }
  console.log('statusCode:', response.statusCode); // The final statusCode
  console.log('Final URI:', response.request.uri); // The final URI
  console.log('Body Length:', body.length); // body length
});
