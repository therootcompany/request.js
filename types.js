'use strict';

module.exports._typesOnly = true;

/**
 * @callback Request
 * @param {Object} opts
 * @param {String} [opts.body]
 * @param {Object.<String,any>} [opts.form]
 * @param {Headers} opts.headers
 * @param {Boolean | String} [opts.json]
 * @param {String} [opts.method]
 * @param {String} opts.url
 * @returns {Response}
 */

/**
 * @typedef {Object} Response
 * @prop {any} body
 * @prop {Headers} headers
 * @prop {Boolean} ok
 * @prop {any} [response] - TODO (browser only)
 * @prop {any} request - TODO
 * @prop {String} status
 * @prop {Number} statusCode
 */

/**
 * @typedef {Object.<String,String|Array<String>>} Headers
 */
