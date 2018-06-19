'use strict';

var http = require('http');
var https = require('https');
var url = require('url');

function debug() {
  if (module.exports.debug) {
    console.log.apply(console, arguments);
  }
}

function mergeOrDelete(defaults, updates) {
  Object.keys(defaults).forEach(function (key) {
    if (!(key in updates)) {
      updates[key] = defaults[key];
      return;
    }

    // neither accept the prior default nor define an explicit value
    // CRDT probs...
    if ('undefined' === typeof updates[key]) {
      delete updates[key];
    } else if ('object' === typeof defaults[key] && 'object' === typeof updates[key]) {
      updates[key] = mergeOrDelete(defaults[key], updates[key]);
    }
  });

  return updates;
}

function toJSONifier(keys) {
  return function () {
    var obj = {};
    var me = this;

    keys.forEach(function (key) {
      if (me[key] && 'function' === typeof me[key].toJSON) {
        obj[key] = me[key].toJSON();
      } else {
        obj[key] = me[key];
      }
    });

    return obj;
  };
}

function setDefaults(defs) {
  defs = defs || {};

  function urequestHelper(opts, cb) {
    debug("[urequest] processed options:");
    debug(opts);

    function onResponse(resp) {
      var followRedirect;

      Object.keys(defs).forEach(function (key) {
        if (key in opts && 'undefined' !== typeof opts[key]) {
          return;
        }
        opts[key] = defs[key];
      });
      followRedirect = opts.followRedirect;

      resp.toJSON = toJSONifier([ 'statusCode', 'body', 'headers', 'request' ]);

      resp.request = req;
      resp.request.uri = url.parse(opts.url);
      //resp.request.method = opts.method;
      resp.request.headers = opts.headers;
      resp.request.toJSON = toJSONifier([ 'uri', 'method', 'headers' ]);

      if (resp.headers.location && opts.followRedirect) {
        debug('Following redirect: ' + resp.headers.location);
        if (opts.followAllRedirects || -1 !== [ 301, 302 ].indexOf(resp.statusCode)) {
          followRedirect = true;
        }
        if (opts._redirectCount >= opts.maxRedirects) {
          followRedirect = false;
        }
        if ('function' === opts.followRedirect) {
          if (!opts.followRedirect(resp)) {
            followRedirect = false;
          }
        }
        if (!opts.followOriginalHttpMethod) {
          opts.method = 'GET';
          opts.body = null;
        }
        if (followRedirect) {
          opts.url = resp.headers.location;
          opts.uri = url.parse(opts.url);
          return urequestHelper(opts, cb);
        }
        if (opts.removeRefererHeader && opts.headers) {
          delete opts.headers.referer;
        }
      }
      if (null === opts.encoding) {
        resp._body = [];
      } else {
        resp.body = '';
      }
      resp._bodyLength = 0;
      resp.on('data', function (chunk) {
        if ('string' === typeof resp.body) {
          resp.body += chunk.toString(opts.encoding);
        } else {
          resp._body.push(chunk);
          resp._bodyLength += chunk.length;
        }
      });
      resp.on('end', function () {
        if ('string' !== typeof resp.body) {
          if (1 === resp._body.length) {
            resp.body = resp._body[0];
          } else {
            resp.body = Buffer.concat(resp._body, resp._bodyLength);
          }
          resp._body = null;
        }
        if (opts.json && 'string' === typeof resp.body) {
          // TODO I would parse based on Content-Type
          // but request.js doesn't do that.
          try {
            resp.body = JSON.parse(resp.body);
          } catch(e) {
            // ignore
          }
        }
        cb(null, resp, resp.body);
      });
    }

    var req;
    var finalOpts = {};

    Object.keys(opts.uri).forEach(function (key) {
      finalOpts[key] = opts.uri[key];
    });
    finalOpts.method = opts.method;
    finalOpts.headers = opts.headers;

    // TODO support unix sockets
    if ('https:' === finalOpts.protocol) {
      // https://nodejs.org/api/https.html#https_https_request_options_callback
      req = https.request(finalOpts, onResponse);
    } else if ('http:' === finalOpts.protocol) {
      // https://nodejs.org/api/http.html#http_http_request_options_callback
      req = http.request(finalOpts, onResponse);
    } else {
      throw new Error("unknown protocol: '" + opts.uri.protocol + "'");
    }

    req.on('error', function (e) {
      cb(e);
    });

    if (opts.body) {
      if (true === opts.json) {
        req.write(JSON.stringify(opts.json));
      } else {
        req.write(opts.body);
      }
    } else if (opts.json && true !== opts.json) {
      req.write(JSON.stringify(opts.json));
    }
    req.end();
  }

  function urequest(opts, cb) {
    debug("[urequest] received options:");
    debug(opts);
    var reqOpts = {};
    // request.js behavior:
    // encoding: null + json ? unknown
    // json => attempt to parse, fail silently
    // encoding => buffer.toString(encoding)
    // null === encoding => Buffer.concat(buffers)
    if ('string' === typeof opts) {
      opts = { url: opts };
    }
    if ('string' === typeof opts.url || 'string' === typeof opts.uri) {
      if ('string' === typeof opts.url) {
        reqOpts.url = opts.url;
        reqOpts.uri = url.parse(opts.url);
      } else if ('string' === typeof opts.uri) {
        reqOpts.url = opts.uri;
        reqOpts.uri = url.parse(opts.uri);
      }
    } else {
      if ('object' === typeof opts.uri) {
        reqOpts.url = url.format(opts.uri);
        reqOpts.uri = opts.uri;
        //reqOpts.uri = url.parse(reqOpts.uri);
      } else if ('object' === typeof opts.url) {
        reqOpts.url = url.format(opts.url);
        reqOpts.uri = opts.url;
        //reqOpts.uri = url.parse(reqOpts.url);
      }
    }
    reqOpts.method = opts.method || 'GET';
    reqOpts.headers = opts.headers || {};
    if ((true === reqOpts.json && reqOpts.body) || reqOpts.json) {
      reqOpts.headers['Content-Type'] = 'application/json';
    }

    module.exports._keys.forEach(function (key) {
      if (key in opts && 'undefined' !== typeof opts[key]) {
        reqOpts[key] = opts[key];
      } else if (key in defs) {
        reqOpts[key] = defs[key];
      }
    });

    return urequestHelper(reqOpts, cb);
  }

  urequest.defaults = function (_defs) {
    _defs = mergeOrDelete(defs, _defs);
    return setDefaults(_defs);
  };
  [ 'get', 'put', 'post', 'patch', 'delete', 'head', 'options' ].forEach(function (method) {
    urequest[method] = function (obj) {
      if ('string' === typeof obj) {
        obj = { url: obj };
      }
      obj.method = method.toUpperCase();
      urequest(obj);
    };
  });
  urequest.del = urequest.delete;

  return urequest;
}

var _defaults = {
  sendImmediately: true
, method: 'GET'
, headers: {}
, useQuerystring: false
, followRedirect: true
, followAllRedirects: false
, followOriginalHttpMethod: false
, maxRedirects: 10
, removeRefererHeader: false
//, encoding: undefined
, gzip: false
//, body: undefined
//, json: undefined
};
module.exports = setDefaults(_defaults);

module.exports._keys = Object.keys(_defaults).concat([
  'encoding'
, 'body'
, 'json'
]);
module.exports.debug = (-1 !== (process.env.NODE_DEBUG||'').split(/\s+/g).indexOf('urequest'));

debug("DEBUG ON for urequest");
