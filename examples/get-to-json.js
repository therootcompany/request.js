'use strict';

//var request = require('request-lite');
var request = require('../');
request('https://www.google.com', function (error, response, body) {
  if (error) {
    console.log('error:', error); // Print the error if one occurred
    return;
  }
  console.log('response.toJSON()');
  console.log(response.toJSON());
});
