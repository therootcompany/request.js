'use strict';

module.exports._typesOnly = true;

/**
 * @callback Request
 * @param {Object} opts
 * @param {any} [opts.body]
 * @param {Object.<String,any>} [opts.form]
 * @param {Headers} [opts.headers]
 * @param {String} [opts.method]
 * @param {Boolean | any} [opts.json]
 * @param {String} opts.url
 * @returns {Response}
 */

/**
 * @typedef {Object} Response
 * @prop {any} body
 * @prop {Headers} headers
 * @prop {Boolean} ok
 * @prop {any} [response] - TODO (browser only)
 * @prop {any} [request] - TODO
 * @prop {String} status
 * @prop {Number} statusCode
 */

/**
 * @typedef {Object.<String,String|Array<String>>} Headers
 */
