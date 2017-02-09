(function() {
  var slice = [].slice,
    util = require('./util');

  /**
    * Volume resource
    * @class Volume
    */
  var Volume = (function() {
    function Volume(client) {
      this.client = client;
    }

    /**
     * List volume objects.
     *
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.list = function() {
      var args = util.extractListArguments(arguments, 0);

      return this.client.get.apply(this.client, ['/volumes', {}].concat(slice.call(args.params), [200, 'volumes', args.callback]));
    };

    /**
     * Create a volume object.
     *
     * @param {object} attributes - The attributes with which to create the Volume. See the {@link https://developers.digitalocean.com/documentation/v2/#volumes|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.create = function(attributes, callback) {
      return this.client.post('/volumes', attributes, 201, 'volume', callback);
    };

    /**
     * Get the identified volume object.
     *
     * @param {string} id - The id of the volume to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.get = function(id, callback) {
      var url = util.safeUrl('volumes', id);
      return this.client.get(url, {}, 200, 'volume', callback);
    };

    /**
     * List of snapshot objects from this volume.
     *
     * @param {number} id - ID of Droplet for which to retrieve snapshots
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Volume.prototype.snapshots = function() {
      var args = util.extractListArguments(arguments, 1);
      var url = util.safeUrl('volumes', args.identifier, 'snapshots');

      return this.client.get.apply(this.client, [url, {}].concat(slice.call(args.params), [200, 'snapshots', args.callback]));
    };

    /**
     * Create a snapshot from the volume.
     *
     * @param {string} id - The id of the volume to snapshot
     * @param {string} name - The name with which to create the snapshot. See the {@link https://developers.digitalocean.com/documentation/v2/#images|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Image
     */
    Volume.prototype.snapshot = function(id, parametersOrName, callback) {
      var parameters;

      if(typeof parametersOrName !== 'object') {
        parameters = {
          name: parametersOrName
        };
      } else {
        parameters = parametersOrName;
      }

      var url = util.safeUrl('volumes', id, 'snapshots');
      return this.client.post(url, parameters, 201, 'snapshot', callback);
    };

    /**
     * Delete the identified volume object.
     *
     * @param {string} id - The id of the volume to delete
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.delete = function(id, callback) {
      var url = util.safeUrl('volumes', id);
      return this.client.delete(url, {}, 204, [], callback);
    };

    /**
     * Delete a volume object identified by name.
     *
     * @param {string} name - The name of the volume to delete
     * @param {string} region - The region of the volume to delete
     * @param {requestCallback} [callback] - callback the handles the response
     * @memberof Volume
     */
    Volume.prototype.deleteByName = function(name, region, callback) {
      var parameters = {
        name: name,
        region: region
      };
      return this.client.delete('volumes', parameters, 204, [], callback);
    };

    /**
     * List of action objects.
     *
     * @param {string} id - ID of volume for which to retrieve actions
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.listActions = function() {
      var args = util.extractListArguments(arguments, 1);
      var url = util.safeUrl('volumes', args.identifier, 'actions');
      return this.client.get.apply(this.client, [url, {}].concat(slice.call(args.params), [200, 'actions', args.callback]));
    };

    /**
     * Get the identified action object.
     *
     * @param {string} volumeId - The id of the volume for which to retrieve the action
     * @param {number} id - The id of the action to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.getAction = function(volumeId, id, callback) {
      var url = util.safeUrl('volumes', volumeId, 'actions', id);
      return this.client.get(url, {}, 200, 'action', callback);
    };

    /**
     * Create an action on the identified volume.
     *
     * @param {string} volumeId - The id of the volume for which to create the action
     * @param {string|object} parametersOrType - The name of the action to create or an object with key value pairs of parameters.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.action = function(volumeId, parametersOrType, callback) {
      var parameters;

      if(typeof parametersOrType === 'string') {
        parameters = { type: parametersOrType };
      } else {
        parameters = parametersOrType;
      }

      var url = util.safeUrl('volumes', volumeId, 'actions');
      return this.client.post(url, parameters, 202, 'action', callback);
    };

    /**
     * Detach the identified volume if it is attached to a Droplet.
     *
     * @param {string} volumeId - The id of the volume for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.detach = function(volumeId, callback) {
      return this.action(volumeId, 'detach', callback);
    };

    /**
     * Attach the identified volume to a given Droplet.
     *
     * @param {string} volumeId - The id of the volume for which to create the action
     * @param {number|object} parametersOrDropletId - If a number, the id of the droplet to which to attach the volume. Otherwise, an object with required keys of `droplet_id`. See the {@link https://developers.digitalocean.com/documentation/v2/#attach-a-block-storage-volume-to-a-droplet|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.attach = function(volumeId, parametersOrDropletId, callback) {
      var parameters;

      if(typeof parametersOrDropletId !== 'object') {
        parameters = {
          droplet_id: parametersOrDropletId
        };
      } else {
        parameters = parametersOrDropletId;
      }
      parameters.type = 'attach';

      return this.action(volumeId, parameters, callback);
    };

    /**
     * Increase the size of the identified volume.
     *
     * @param {string} volumeId - The id of the volume for which to create the action
     * @param {number|object} parametersOrSizeGibabytes - If a number, the size in gigabytes to which the volume should be resized. Otherwise, an object with required keys of `size_gigabytes` and `region`. See the {@link https://developers.digitalocean.com/documentation/v2/#resize-a-volume|official docs} for valid attributes.
     * @param {string} region - The slug of the region in which the drive was created
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Volume
     */
    Volume.prototype.resize = function(volumeId, parametersOrSizeGibabytes, region, callback) {
      var parameters;

      if(typeof parametersOrSizeGibabytes !== 'object') {
        parameters = {
          size_gigabytes: parametersOrSizeGibabytes,
          region: region
        };
      } else {
        parameters = parametersOrSizeGibabytes;
        callback = region;
      }
      parameters.type = 'resize';

      return this.action(volumeId, parameters, callback);
    };

    return Volume;
  })();

  module.exports = Volume;
}).call(this);
