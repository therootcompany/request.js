# request-lite - A lightweight drop-in replacement for request

A zero-dependency alternative to request for 90% of the use cases with only 10% of the code.

Written from scratch.

## Super simple to use

request-lite is designed to be a drop-in replacement for request.  It supports HTTPS and follows redirects by default.

```bash
npm install --save request-lite
```

```js
var request = require('request-lite');
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
```

---

## request(options, callback)

The first argument can be either a `url` or an `options` object. The only required option is `uri`; all others are optional.

- `uri` || `url` - fully qualified uri or a parsed url object from `url.parse()`
- `method` - http method (default: `"GET"`)
- `headers` - http headers (default: `{}`)

<!-- TODO
- `baseUrl` - fully qualified uri string used as the base url. Most useful with `request.defaults`, for example when you want to do many requests to the same domain. If `baseUrl` is `https://example.com/api/`, then requesting `/end/point?test=true` will fetch `https://example.com/api/end/point?test=true`. When `baseUrl` is given, `uri` must also be a string.
-->

---

- `body` - entity body for PATCH, POST and PUT requests. Must be a `Buffer`, `String` or `ReadStream`. If `json` is `true`, then `body` must be a JSON-serializable object.
- `json` - sets `body` to JSON representation of value and adds `Content-type: application/json` header. Additionally, parses the response body as JSON.

<!-- TODO
- `form` - when passed an object or a querystring, this sets `body` to a querystring representation of value, and adds `Content-type: application/x-www-form-urlencoded` header. When passed no options, a `FormData` instance is returned (and is piped to request). See "Forms" section above.
- `formData` - data to pass for a `multipart/form-data` request. See
  [Forms](#forms) section above.
- `multipart` - array of objects which contain their own headers and `body`
  attributes. Sends a `multipart/related` request. See [Forms](#forms) section
  above.
  - Alternatively you can pass in an object `{chunked: false, data: []}` where
    `chunked` is used to specify whether the request is sent in
    [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)
    In non-chunked requests, data items with body streams are not allowed.
- `preambleCRLF` - append a newline/CRLF before the boundary of your `multipart/form-data` request.
- `postambleCRLF` - append a newline/CRLF at the end of the boundary of your `multipart/form-data` request.
- `jsonReviver` - a [reviver function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) that will be passed to `JSON.parse()` when parsing a JSON response body.
- `jsonReplacer` - a [replacer function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) that will be passed to `JSON.stringify()` when stringifying a JSON request body.
-->

---

- `followRedirect` - follow HTTP 3xx responses as redirects (default: `true`). This property can also be implemented as function which gets `response` object as a single argument and should return `true` if redirects should continue or `false` otherwise.
- `followAllRedirects` - follow non-GET HTTP 3xx responses as redirects (default: `false`)
- `followOriginalHttpMethod` - by default we redirect to HTTP method GET. you can enable this property to redirect to the original HTTP method (default: `false`)
- `maxRedirects` - the maximum number of redirects to follow (default: `10`)
- `removeRefererHeader` - removes the referer header when a redirect happens (default: `false`). **Note:** if true, referer header set in the initial request is preserved during redirect chain.

---

- `encoding` - encoding to be used on `setEncoding` of response data. If `null`, the `body` is returned as a `Buffer`. Anything else **(including the default value of `undefined`)** will be passed as the [encoding](http://nodejs.org/api/buffer.html#buffer_buffer) parameter to `toString()` (meaning this is effectively `utf8` by default). (**Note:** if you expect binary data, you should set `encoding: null`.)

<!-- TODO
- `gzip` - if `true`, add an `Accept-Encoding` header to request compressed content encodings from the server (if not already present) and decode supported content encodings in the response. **Note:** Automatic decoding of the response content is performed on the body data returned through `request` (both through the `request` stream and passed to the callback function) but is not performed on the `response` stream (available from the `response` event) which is the unmodified `http.IncomingMessage` object which may contain compressed data. See example below.
- `jar` - if `true`, remember cookies for future use (or define your custom cookie jar; see examples section)
-->

---

## Convenience methods

There are also shorthand methods for different HTTP METHODs and some other conveniences.

### request.defaults(options)

This method **returns a wrapper** around the normal request API that defaults
to whatever options you pass to it.

**Note:** `request.defaults()` **does not** modify the global request API;
instead, it **returns a wrapper** that has your default settings applied to it.

**Note:** You can call `.defaults()` on the wrapper that is returned from
`request.defaults` to add/override defaults that were previously defaulted.

For example:
```js
//requests using baseRequest() will set the 'x-token' header
var baseRequest = request.defaults({
  headers: {'x-token': 'my-token'}
})

//requests using specialRequest() will include the 'x-token' header set in
//baseRequest and will also include the 'special' header
var specialRequest = baseRequest.defaults({
  headers: {special: 'special value'}
})
```

### request.METHOD()

These HTTP method convenience functions act just like `request()` but with a default method already set for you:

- *request.get()*: Defaults to `method: "GET"`.
- *request.post()*: Defaults to `method: "POST"`.
- *request.put()*: Defaults to `method: "PUT"`.
- *request.patch()*: Defaults to `method: "PATCH"`.
- *request.del() / request.delete()*: Defaults to `method: "DELETE"`.
- *request.head()*: Defaults to `method: "HEAD"`.
- *request.options()*: Defaults to `method: "OPTIONS"`.

## Debugging

There are at least <!--three--> two ways to debug the operation of `request`:

1. Launch the node process like `NODE_DEBUG=request-lite node script.js`
   (`lib,request,otherlib` works too).

2. Set `require('request-lite').debug = true` at any time (this does the same thing
   as #1).

<!-- TODO
3. Use the [request-debug module](https://github.com/request/request-debug) to
   view request and response headers and bodies.

[back to top](#table-of-contents)
-->
