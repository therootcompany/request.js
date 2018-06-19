# µRequest - Minimalist HTTP client

A minimal drop-in replacement for request with 0 dependenciese.

## Super simple to use

µRequest is designed to be a minimal drop-in replacement for request.

```js
var request = require('urequest');
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
```
