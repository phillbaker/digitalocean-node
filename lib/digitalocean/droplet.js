(function() {
  var slice = [].slice,
    util = require('./util');

  var Droplet = (function() {
    function Droplet(client) {
      this.client = client;
    }

    // page or query object, optional
    // perPage, optional
    // callback, optional
    Droplet.prototype.list = function() {
      var i,
          params = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []),
          callback = arguments[i++];

      return this.client.get.apply(this.client, ['/droplets', {}].concat(slice.call(params), [200, 'droplets', callback]));
    };

    // tagName, required
    // page, optional
    // perPage, optional
    // callback, optional
    Droplet.prototype.listByTag = function() {
      var tag = arguments[0],
          i,
          params = 3 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []),
          callback = arguments[i++],
          page = params[0],
          perPage = params[1],
          options = { tag_name: tag, page: page, per_page: perPage };

      return this.client.get.apply(this.client, ['/droplets', {}, options, 200, 'droplets', callback]);
    };

    // attributes, required
    // callback, optional
    Droplet.prototype.create = function(attributes, callback) {
      return this.client.post('/droplets', attributes, 202, ['droplet', 'droplets'], callback);
    };

    // id, required
    // callback, optional
    Droplet.prototype.get = function(id, callback) {
      var url = util.safeUrl('droplets', id);
      return this.client.get(url, {}, 200, 'droplet', callback);
    };

    // id, required
    // page or query object, optional
    // perPage, optional
    // callback, optional
    Droplet.prototype.kernels = function() {
      var id = arguments[0],
          i,
          params = 2 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []),
          callback = arguments[i++];

      var url = util.safeUrl('droplets', id, 'kernels');
      return this.client.get.apply(this.client, [url, {}].concat(slice.call(params), [200, 'kernels', callback]));
    };

    // id, required
    // page or query object, optional
    // perPage, optional
    // callback, optional
    Droplet.prototype.snapshots = function() {
      var id = arguments[0],
          i,
          params = 2 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []),
          callback = arguments[i++];

      var url = util.safeUrl('droplets', id, 'snapshots');
      return this.client.get.apply(this.client, [url, {}].concat(slice.call(params), [200, 'snapshots', callback]));
    };

    // id, required
    // page or query object, optional
    // perPage, optional
    // callback, optional
    Droplet.prototype.backups = function() {
      var id = arguments[0],
          i,
          params = 2 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []),
          callback = arguments[i++];

      var url = util.safeUrl('droplets', id, 'backups');
      return this.client.get.apply(this.client, [url, {}].concat(slice.call(params), [200, 'backups', callback]));
    };

    // id, required
    // page or query object, optional
    // perPage, optional
    // callback, optional
    Droplet.prototype.neighbors = function() {
      var id = arguments[0],
          i,
          params = 2 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []),
          callback = arguments[i++];

      var url = util.safeUrl('droplets', id, 'neighbors');
      return this.client.get.apply(this.client, [url, {}].concat(slice.call(params), [200, 'droplets', callback]));
    };

    // id, required
    // callback, optional
    Droplet.prototype.delete = function(id, callback) {
      var url = util.safeUrl('droplets', id);
      return this.client.delete(url, {}, 204, [], callback);
    };

    // name, required
    // callback, optional
    Droplet.prototype.deleteByTag = function(name, callback) {
      var url = util.safeUrl('droplets');
      var params = { tag_name: encodeURIComponent(name) };
      return this.client.delete(url, params, 204, [], callback);
    };

    // dropletId, required
    // page or query object, optional
    // perPage, optional
    // callback, optional
    Droplet.prototype.listActions = function() {
      var dropletId = arguments[0],
          i,
          params = 2 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []),
          callback = arguments[i++];

      var url = util.safeUrl('droplets', dropletId, 'actions');
      return this.client.get.apply(this.client, [url, {}].concat(slice.call(params), [200, 'actions', callback]));
    };

    // dropletId, rqeuired
    // id, required
    // callback, optional
    Droplet.prototype.getAction = function(dropletId, id, callback) {
      var url = util.safeUrl('droplets', dropletId, 'actions', id);
      return this.client.get(url, {}, 200, 'action', callback);
    };

    // dropletId, required
    // parametersOrType, required
    // callback, optional
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

    // tagName, required
    // actionType, required
    // callback, optional
    Droplet.prototype.actionByTag = function(tagName, actionType, callback) {
      var parameters = {
        tag_name: tagName,
        type: actionType
      };

      return this.client.post('/droplets/actions', parameters, 201, 'actions', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.shutdown = function(dropletId, callback) {
      return this.action(dropletId, 'shutdown', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.powerOff = function(dropletId, callback) {
      return this.action(dropletId, 'power_off', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.powerOn = function(dropletId, callback) {
      return this.action(dropletId, 'power_on', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.powerCycle = function(dropletId, callback) {
      return this.action(dropletId, 'power_cycle', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.reboot = function(dropletId, callback) {
      return this.action(dropletId, 'reboot', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.enableBackups = function(dropletId, callback) {
      return this.action(dropletId, 'enable_backups', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.disableBackups = function(dropletId, callback) {
      return this.action(dropletId, 'disable_backups', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.passwordReset = function(dropletId, callback) {
      return this.action(dropletId, 'password_reset', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.enableIPv6 = function(dropletId, callback) {
      return this.action(dropletId, 'enable_ipv6', callback);
    };

    // dropletId, required
    // callback, optional
    Droplet.prototype.enablePrivateNetworking = function(dropletId, callback) {
      return this.action(dropletId, 'enable_private_networking', callback);
    };

    // dropletId, required
    // parametersOrSizeSlug, required keys: size string; optional keys: disk bool
    // callback, optional
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

    // dropletId, required
    // parametersOrHostname, required keys: name string
    // callback, optional
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

    // dropletId, required
    // parametersOrName, required keys: name string
    // callback, optional
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

    // dropletId, required
    // parametersOrImageId, required keys: image int
    // callback, optional
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

    // dropletId, required
    // parametersOrImage, required keys: image int (dropletId) or string (slug)
    // callback, optional
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

    // dropletId, required
    // parametersOrKernelId, required keys: kernel int (dropletId)
    // callback, optional
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
