'use strict';

//var request = require('request-lite');
var request = require('../');

// would normally redirect to https://www.github.com and then https://github.com
request({ uri: 'https://www.github.com', followRedirect: false }, function (error, response, body) {
  if (error) {
    console.log('error:', error); // Print the error if one occurred
    return;
  }
  console.log('href:', response.request.uri.href); // The final URI
  console.log('statusCode:', response.statusCode); // Should be 301 or 302
  console.log('Location:', response.headers.location); // The redirect
  console.log('Body:', body || JSON.stringify(body));
});
