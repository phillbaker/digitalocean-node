(function() {
  var slice = [].slice,
    util = require('./util');

  /**
   * Certificate resource
   * @class Certificate
   */
  var Certificate = (function() {
    function Certificate(client) {
      this.client = client;
    }

    /**
     * List all SSL certificates.
     *
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Certificate
     */
    Certificate.prototype.list = function() {
      var args = util.extractListArguments(arguments, 0);
      return this.client.get.apply(this.client, ['/certificates',
        {}].concat(slice.call(args.params), [200, 'certificates',
        args.callback]));
    };

    /**
     * Create a certificate object.
     *
     * @param {object} attributes - The attributes with which to create the domain. See the {@link https://developers.digitalocean.com/documentation/v2/#certificates|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Certificate
     */
    Certificate.prototype.create = function(attributes, callback) {
      return this.client.post(
        '/certificates', attributes, 201, 'certificate', callback);
    };

    /**
     * Get the identified certificate object.
     *
     * @param {string} id - The id of the domain to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Certificate
     */
    Certificate.prototype.get = function(id, callback) {
      var url = util.safeUrl('certificates', id);
      return this.client.get(url, {}, 200, 'certificate', callback);
    };

    /**
     * Delete the identified certificate object.
     *
     * @param {string} id - The id of the domain to delete
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Certificate
     */
    Certificate.prototype.delete = function(id, callback) {
      var url = util.safeUrl('certificates', id);
      return this.client.delete(url, {}, 204, [], callback);
    };

    return Certificate;
  })();

  module.exports = Certificate;
}).call(this);
