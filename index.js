'use strict';

var http = require('http');
var https = require('https');
var url = require('url');

function debug() {
  if (module.exports.debug) {
    console.log.apply(console, arguments);
  }
}

function applyUrl(opts, urlstr) {
  var urlObj = url.parse(urlstr);
  opts.url = opts.uri = urlstr;
  Object.keys(urlObj).forEach(function (key) {
    opts[key] = urlObj[key];
  });
  return opts;
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

function setDefaults(defs) {
  defs = defs || {};

  function urequest(opts, cb) {
    var req;
    // request.js behavior:
    // encoding: null + json ? unknown
    // json => attempt to parse, fail silently
    // encoding => buffer.toString(encoding)
    // null === encoding => Buffer.concat(buffers)
    if ('string' === typeof opts) {
      opts = { url: opts };
    }
    if (!opts.method) {
      opts.method = 'GET';
    }
    if (!opts.method) {
      opts.method = 'GET';
    }
    if (opts.url || opts.uri) {
      opts = applyUrl(opts, opts.url || opts.uri);
    }
    function onResponse(resp) {
      var encoding = opts.encoding || defs.encoding;
      var followRedirect;
      Object.keys(defs).forEach(function (key) {
        if (key in opts && 'undefined' !== typeof opts[key]) {
          return;
        }
        opts[key] = defs[key];
      });
      followRedirect = opts.followRedirect;

      resp.request = req;
      resp.request.uri = opts.uri;
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
          return urequest(opts, cb);
        }
        if (opts.removeRefererHeader && opts.headers) {
          delete opts.headers.referer;
        }
      }
      if (null === encoding) {
        resp._body = [];
      } else {
        resp.body = '';
      }
      resp._bodyLength = 0;
      resp.on('data', function (chunk) {
        if ('string' === typeof resp.body) {
          resp.body += chunk.toString(encoding);
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

    if (!opts.protocol) {
      opts.protocol = 'https:';
    }
    if ('https:' === opts.protocol) {
      req = https.request(opts, onResponse);
    } else if ('http:' === opts.protocol) {
      req = http.request(opts, onResponse);
    } else {
      throw new Error("unknown protocol: '" + opts.protocol + "'");
    }
    req.on('error', function (e) {
      cb(e);
    });
    if (opts.body) {
      if (true === opts.json) {
        req.end(JSON.stringify(opts.json));
      } else {
        req.end(opts.body);
      }
    } else if (opts.json && true !== opts.json) {
      req.end(JSON.stringify(opts.json));
    } else {
      req.end();
    }
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

module.exports = setDefaults({
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
});
module.exports.debug = (-1 !== (process.env.NODE_DEBUG||'').split(/\s+/g).indexOf('urequest'));

debug("DEBUG ON for urequest");
