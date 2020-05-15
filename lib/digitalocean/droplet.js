(function() {
  var slice = [].slice,
    util = require('./util');

  /**
    * Droplet resource
    * @class Droplet
    */
  var Droplet = (function() {
    function Droplet(client) {
      this.client = client;
    }

    /**
     * List Droplet objects.
     *
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {listRequestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.list = function() {
      var args = util.extractListArguments(arguments, 0);

      return this.client.get.apply(this.client, ['/droplets', {}].concat(slice.call(args.params), [200, 'droplets', args.callback]));
    };

    /**
     * Create a Droplet object.
     *
     * @param {object} attributes - The attributes with which to create the Droplet. See the {@link https://developers.digitalocean.com/documentation/v2/#droplets|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.create = function(attributes, callback) {
      return this.client.post('/droplets', attributes, 202, ['droplet', 'droplets'], callback);
    };

    /**
     * Get the identified Droplet object.
     *
     * @param {number} id - The id of the Droplet to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.get = function(id, callback) {
      var url = util.safeUrl('droplets', id);
      return this.client.get(url, {}, 200, 'droplet', callback);
    };

    /**
     * List kernel objects.
     *
     * @param {number} id - ID of Droplet for which to retrieve kernels
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {listRequestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.kernels = function() {
      var args = util.extractListArguments(arguments, 1);
      var url = util.safeUrl('droplets', args.identifier, 'kernels');

      return this.client.get.apply(this.client, [url, {}].concat(slice.call(args.params), [200, 'kernels', args.callback]));
    };

    /**
     * List of image objects that are snapshots of the Droplet.
     *
     * @param {number} id - ID of Droplet for which to retrieve snapshots
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {listRequestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.snapshots = function() {
      var args = util.extractListArguments(arguments, 1);
      var url = util.safeUrl('droplets', args.identifier, 'snapshots');

      return this.client.get.apply(this.client, [url, {}].concat(slice.call(args.params), [200, 'snapshots', args.callback]));
    };

    /**
     * List backup objects that are backups of the Droplet.
     *
     * @param {number} id - ID of Droplet for which to retrieve backups
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {listRequestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.backups = function() {
      var args = util.extractListArguments(arguments, 1);
      var url = util.safeUrl('droplets', args.identifier, 'backups');

      return this.client.get.apply(this.client, [url, {}].concat(slice.call(args.params), [200, 'backups', args.callback]));
    };

    /**
     * List of Droplet objects that are physically co-located with the Droplet.
     *
     * @param {number} id - ID of Droplet for which to retrieve neighbors
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {listRequestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.neighbors = function() {
      var args = util.extractListArguments(arguments, 1);
      var url = util.safeUrl('droplets', args.identifier, 'neighbors');

      return this.client.get.apply(this.client, [url, {}].concat(slice.call(args.params), [200, 'droplets', args.callback]));
    };

    /**
     * Delete the identified Droplet object.
     *
     * @param {number} id - The id of the Droplet to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.delete = function(id, callback) {
      var url = util.safeUrl('droplets', id);
      return this.client.delete(url, {}, 204, [], callback);
    };

    /**
     * Delete the Droplets associated with the tag identified by the name.
     *
     * @param {string} name - The name of the tag for which to delete Droplets.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.deleteByTag = function(name, callback) {
      var url = util.safeUrl('droplets');
      var params = { tag_name: encodeURIComponent(name) };
      return this.client.delete(url, {}, { query: params }, 204, [], callback);
    };

    /**
     * List of action objects.
     *
     * @param {number} id - ID of Droplet for which to retrieve actions
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {listRequestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.listActions = function() {
      var args = util.extractListArguments(arguments, 1);
      var url = util.safeUrl('droplets', args.identifier, 'actions');

      return this.client.get.apply(this.client, [url, {}].concat(slice.call(args.params), [200, 'actions', args.callback]));
    };

    /**
     * Get the identified action object.
     *
     * @param {number} dropletId - The id of the droplet for which to retrieve the action
     * @param {number} id - The id of the action to retrieve
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.getAction = function(dropletId, id, callback) {
      var url = util.safeUrl('droplets', dropletId, 'actions', id);
      return this.client.get(url, {}, 200, 'action', callback);
    };

    /**
     * Create an action on the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {string|object} parametersOrType - The name of the action to create or an object with key value pairs of parameters.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.action = function(dropletId, parametersOrType, callback) {
      var parameters;

      if(typeof parametersOrType === 'string') {
        parameters = { type: parametersOrType };
      } else {
        parameters = parametersOrType;
      }

      var url = util.safeUrl('droplets', dropletId, 'actions');
      return this.client.post(url, parameters, 201, 'action', callback);
    };

    /**
     * Delete the Droplets associated with the tag identified by the name.
     *
     * @param {string} name - The name of the tag for which to delete Droplets.
     * @param {string} actionType - The type of action to perform. See the {@link https://developers.digitalocean.com/documentation/v2/#acting-on-tagged-droplets|official docs} for accepted actions.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.actionByTag = function(tagName, actionType, callback) {
      var parameters = {
        tag_name: tagName,
        type: actionType
      };

      return this.client.post('/droplets/actions', parameters, 201, 'actions', callback);
    };

    /**
     * Shutdown the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.shutdown = function(dropletId, callback) {
      return this.action(dropletId, 'shutdown', callback);
    };

    /**
     * Power off the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.powerOff = function(dropletId, callback) {
      return this.action(dropletId, 'power_off', callback);
    };

    /**
     * Power on the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.powerOn = function(dropletId, callback) {
      return this.action(dropletId, 'power_on', callback);
    };

    /**
     * Power cycle the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.powerCycle = function(dropletId, callback) {
      return this.action(dropletId, 'power_cycle', callback);
    };

    /**
     * Reboot the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.reboot = function(dropletId, callback) {
      return this.action(dropletId, 'reboot', callback);
    };

    /**
     * Enable backups on the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.enableBackups = function(dropletId, callback) {
      return this.action(dropletId, 'enable_backups', callback);
    };

    /**
     * Disable backups on the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.disableBackups = function(dropletId, callback) {
      return this.action(dropletId, 'disable_backups', callback);
    };

    /**
     * Reset the root user's password on the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.passwordReset = function(dropletId, callback) {
      return this.action(dropletId, 'password_reset', callback);
    };

    /**
     * Enable IPv6 networking on the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.enableIPv6 = function(dropletId, callback) {
      return this.action(dropletId, 'enable_ipv6', callback);
    };

    /**
     * Enable private-to-the-datacenter networking on the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.enablePrivateNetworking = function(dropletId, callback) {
      return this.action(dropletId, 'enable_private_networking', callback);
    };

    /**
     * Change the available resources for the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {string|object} parametersOrSizeSlug - If a string, the name of the size to change the Droplet to. Otherwise, an object with required keys of `size`. See the {@link https://developers.digitalocean.com/documentation/v2/#resize-a-droplet|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.resize = function(dropletId, parametersOrSizeSlug, callback) {
      var parameters;

      if(typeof parametersOrSizeSlug !== 'object') {
        parameters = {
          size: parametersOrSizeSlug
        };
      } else {
        parameters = parametersOrSizeSlug;
      }
      parameters.type = 'resize';

      return this.action(dropletId, parameters, callback);
    };

    /**
     * Change the hostname of the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {string|object} parametersOrHostname - If a string, the hostname to change the Droplet to. Otherwise, an object with required keys of `name`. See the {@link https://developers.digitalocean.com/documentation/v2/#rename-a-droplet|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.rename = function(dropletId, parametersOrHostname, callback) {
      var parameters;

      if(typeof parametersOrHostname !== 'object') {
        parameters = {
          name: parametersOrHostname
        };
      } else {
        parameters = parametersOrHostname;
      }
      parameters.type = 'rename';

      return this.action(dropletId, parameters, callback);
    };

    /**
     * Create a snapshot image of the identified Droplet.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {string|object} parametersOrName - If a string, the name of the created image. Otherwise, an object with required keys of `name`. See the {@link https://developers.digitalocean.com/documentation/v2/#snapshot-a-droplet|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.snapshot = function(dropletId, parametersOrName, callback) {
      var parameters;

      if(typeof parametersOrName !== 'object') {
        parameters = {
          name: parametersOrName
        };
      } else {
        parameters = parametersOrName;
      }
      parameters.type = 'snapshot';

      return this.action(dropletId, parameters, callback);
    };

    /**
     * Recreate the Droplet from the identified image snapshot or backup.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {number|object} parametersOrImageId - If a number, identifier of the image to use. Otherwise, an object with required keys of `image`. See the {@link https://developers.digitalocean.com/documentation/v2/#restore-a-droplet|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.restore = function(dropletId, parametersOrImageId, callback) {
      var parameters;

      if(typeof parametersOrImageId !== 'object') {
        parameters = {
          image: parametersOrImageId
        };
      } else {
        parameters = parametersOrImageId;
      }
      parameters.type = 'restore';

      return this.action(dropletId, parameters, callback);
    };

    /**
     * Recreate the Droplet from the identified distribution image.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {string|number|object} parametersOrImage - If a string, the slug of the distribution image to use. If a number, the identifier of the distribution image to use. Otherwise, an object with required keys of `image`. See the {@link https://developers.digitalocean.com/documentation/v2/#rebuild-a-droplet|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.rebuild = function(dropletId, parametersOrImage, callback) {
      var parameters;

      if(typeof parametersOrImage !== 'object') {
        parameters = {
          image: parametersOrImage
        };
      } else {
        parameters = parametersOrImage;
      }
      parameters.type = 'rebuild';

      return this.action(dropletId, parameters, callback);
    };

    /**
     * Recreate the Droplet from the identified distribution image.
     *
     * @param {number} dropletId - The id of the droplet for which to create the action
     * @param {number|object} parametersOrKernelId - If a number, the identifier of the kernel to use. Otherwise, an object with required keys of `kernel`. See the {@link https://developers.digitalocean.com/documentation/v2/#change-the-kernel|official docs} for valid attributes.
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Droplet
     */
    Droplet.prototype.changeKernel = function(dropletId, parametersOrKernelId, callback) {
      var parameters;

      if(typeof parametersOrKernelId !== 'object') {
        parameters = {
          kernel: parametersOrKernelId
        };
      } else {
        parameters = parametersOrKernelId;
      }
      parameters.type = 'change_kernel';

      return this.action(dropletId, parameters, callback);
    };

    return Droplet;
  })();

  module.exports = Droplet;
}).call(this);
