(function() {
  var slice = [].slice,
    util = require('./util');

  /**
    * Firewall resource
    * @class Firewall
    */
  var Firewall = (function() {
    function Firewall(client) {
      this.client = client;
    }
 
    /**
     * List firewall objects.
     *
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {listRequestCallback} [callback] - callback that handles the response
     * @memberof Tag
     */
    Firewall.prototype.list = function() {
      var args = util.extractListArguments(arguments, 0);
      return this.client.get.apply(this.client, ['/firewalls', {}].concat(slice.call(args.params), [200, 'firewalls', args.callback]));
    };

    /**
     * Create a firewall object.
     *
     * @param {object} attributes - The attributes with which to create the firewall. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.create = function(attributes, callback) {
      return this.client.post('/firewalls', attributes, 201, 'firewall', callback);
    };

    /**
     * Get the identified firewall object.
     *
     * @param {string} id - The id of the firewall to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.get = function(id, callback) {
      var url = util.safeUrl('firewalls', id);
      return this.client.get(url, {}, 200, 'firewall', callback);
    };

    /**
     * @typedef Resources
     * @type {object}
     * @property {string} resource_id - a resource ID.
     * @property {string} resource_type - a resource type.
     */

    /**
     * Associate the identified tag with the identified resources.
     *
     * @param {string} name - The name of the tag to udpate
     * @param {Resources[]} resources - An array of objects each with keys of resource_id and resource_type.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Tag
     */
/*
    Tag.prototype.tag = function(name, resources, callback) {
      var attributes = { "resources": resources };
      var url = util.safeUrl('tags', name, 'resources');
      return this.client.post(url, attributes, 204, [], callback);
    };
*/
    /**
     * Unassociate the identified tag with the identified resources.
     *
     * @param {string} name - The name of the tag to udpate
     * @param {Resources[]} resources - An array of objects each with keys of resource_id and resource_type.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Tag
     */
/*
    Tag.prototype.untag = function(name, resources, callback) {
      var attributes = { "resources": resources };
      var url = util.safeUrl('tags', name, 'resources');
      return this.client.delete(url, attributes, 204, [], callback);
    };
*/
    /**
     * Delete the identified tag object.
     *
     * @param {string} name - The name of the tag to delete
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Tag
     */
/*
    Tag.prototype.delete = function(name, callback) {
      var url = util.safeUrl('tags', name);
      return this.client.delete(url, {}, 204, [], callback);
    };
*/
    return Firewall;
  })();

  module.exports = Firewall;
}).call(this);
