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
      return this.client.post('/firewalls', attributes, 202, 'firewall', callback);
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
     * Delete the identified firewall object.
     *
     * @param {string} id - The id of the firewall to delete
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */

    Firewall.prototype.delete = function(id, callback) {
      var url = util.safeUrl('firewalls', id);
      return this.client.delete(url, {}, 204, [], callback);
    };

    /**
     * Update the identified firewall object.
     *
     * @param {string} id - The id of the firewall to update
     * @param {object} attributes - The attributes with which to create the firewall. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */

    Firewall.prototype.update = function(id, attributes, callback) {
      var url = util.safeUrl('firewalls', id);
      return this.client.put(url, attributes, 200, [], callback);
    };

    /**
     * Add droplets to a firewall.
     *
     * @param {string} firewallId - The id of the firewall to update
     * @param {number|number[]} dropletIds - The ids of droplets to add. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.addDroplets = function(firewallId, dropletIds, callback) {
      var dropletIdsObject = {
        droplet_ids: Array.isArray(dropletIds) ? dropletIds : [dropletIds]
      };
      var url = util.safeUrl('firewalls', firewallId, 'droplets');
      return this.client.post(url, dropletIdsObject, 204, [], callback);
    };

    /**
     * Remove droplets from a firewall.
     *
     * @param {string} firewallId - The id of the firewall to update
     * @param {number|number[]} dropletIds - The ids of droplets to remove. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.removeDroplets = function(firewallId, dropletIds, callback) {
      var dropletIdsObject = {
        droplet_ids: Array.isArray(dropletIds) ? dropletIds : [dropletIds]
      };
      var url = util.safeUrl('firewalls', firewallId, 'droplets');
      return this.client.delete(url, dropletIdsObject, 204, [], callback);
    };

    /**
     * Add tags to a firewall.
     *
     * @param {string} firewallId - The id of the firewall to update
     * @param {string|string[]} tags - Tags to add. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.addTags = function(firewallId, tags, callback) {
      var tagsObject = {
        tags: Array.isArray(tags) ? tags : [tags]
      };
      var url = util.safeUrl('firewalls', firewallId, 'tags');
      return this.client.post(url, tagsObject, 204, [], callback);
    };

    /**
     * Remove tags from a firewall.
     *
     * @param {string} firewallId - The id of the firewall to update
     * @param {string|string[]} tags - Tags to add. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.removeTags = function(firewallId, tags, callback) {
      var tagsObject = {
        tags: Array.isArray(tags) ? tags : [tags]
      };
      var url = util.safeUrl('firewalls', firewallId, 'tags');
      return this.client.delete(url, tagsObject, 204, [], callback);
    };

    /**
     * Add rules to a firewall.
     *
     * @param {string} firewallId - The id of the firewall to update
     * @param {object} rules - The rule definition object. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.addRules = function(firewallId, rules, callback) {
      var url = util.safeUrl('firewalls', firewallId, 'rules');
      return this.client.post(url, rules, 204, [], callback);
    };

    /**
     * Remove rules from a firewall.
     *
     * @param {string} firewallId - The id of the firewall to update
     * @param {object} rules - The rule definition object. See the {@link https://developers.digitalocean.com/documentation/v2/#firewalls|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Firewall
     */
    Firewall.prototype.removeRules = function(firewallId, rules, callback) {
      var url = util.safeUrl('firewalls', firewallId, 'rules');
      return this.client.delete(url, rules, 204, [], callback);
    };

    return Firewall;
  })();

  module.exports = Firewall;
}).call(this);
