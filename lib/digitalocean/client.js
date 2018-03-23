(function() {
  // External Dependencies
  var url = require('url'),
    request = require('request'),
    Promise = require('bluebird'),
    deepExtend = require('deep-extend');

  // API sections
  var Account = require('./account'),
    Action = require('./action'),
    Volume = require('./volume'),
    Certificate = require('./certificate'),
    Domain = require('./domain'),
    Droplet = require('./droplet'),
    FloatingIp = require('./floating_ip'),
    Firewall = require('./firewall'),
    Image = require('./image'),
    LoadBalancer = require('./load_balancer'),
    Region = require('./region'),
    Size = require('./size'),
    Snapshot = require('./snapshot'),
    Tag = require('./tag');

  // Utilities
  var slice = [].slice,
    util = require('./util'),
    DigitalOceanError = require('./error');

  /**
    * Client resource
    * @class Client
    */
  var Client = (function() {
    /**
     * @typedef ClientOptions
     * @type {object}
     * @property {object} [request] - pass in a specific version of the request library.
     * @property {object} [promise] - pass in a specific version of promise library.
     * @property {object} [requestOptions] - a base set of options provided to Request, overridden by options passed to a specific API method. defaults to empty object.
     * @property {boolean} [decamelizeKeys] - whether to automagically translate query and JSON body keys to use underscore separated names.
     * @property {string} [protocol] - defaults to https.
     * @property {string} [hostname] - defaults to api.digitalocean.com.
     * @property {string} [port] - defaults to protocol default (e.g. with a protocol of https defaults to 443).
     */

    /**
     * Create a new Client instance.
     *
     * @param {string} token - The DigitalOcean token used for authorization.
     * @param {ClientOptions} [options] - An object whose values are used to configure a client instance.
     * @memberof Client
     */
    function Client(token, options) {
      this.token = token;
      this.options = options;

      this.requestOptions = this.options && this.options.requestOptions || {};
      this.request = this.options && this.options.request || request;
      this.promise = this.options && this.options.promise || Promise;
      this.decamelizeKeys = this.options ? this.options.decamelizeKeys : true;

      var version = require('../../package.json').version;
      this.requestDefaults = {
        headers: {
          'User-Agent': 'digitalocean-node/' + version,
          'Content-Type': 'application/json'
        }
      };

      this.version = 'v2';
      this.host = 'api.digitalocean.com';

      this.account = new Account(this);
      this.actions = new Action(this);
      this.volumes = new Volume(this);
      this.certificates = new Certificate(this);
      this.domains = new Domain(this);
      this.droplets = new Droplet(this);
      this.floatingIps = new FloatingIp(this);
      this.firewalls = new Firewall(this);
      this.images = new Image(this);
      this.loadBalancers = new LoadBalancer(this);
      this.regions = new Region(this);
      this.sizes = new Size(this);
      this.snapshots = new Snapshot(this);
      this.tags = new Tag(this);
    }

    /** @private */
    Client.prototype._buildUrl = function(path, urlParams) {
      if (path == null) {
        path = '/';
      }

      if (urlParams == null) {
        urlParams = {};
      }

      var urlFromPath = url.parse(this.version + path);

      if (!!this.decamelizeKeys) {
        urlParams = util.decamelizeKeys(urlParams);
      }

      return url.format({
        protocol: urlFromPath.protocol || this.options && this.options.protocol || "https:",
        auth: urlFromPath.auth || (this.token && this.token.username && this.token.password ? this.token.username + ":" + this.token.password : ''),
        hostname: urlFromPath.hostname || this.options && this.options.hostname || this.host,
        port: urlFromPath.port || this.options && this.options.port,
        pathname: urlFromPath.pathname,
        query: urlParams
      });
    };

    // Returns a function that curries the callback to handle the response from
    // `request`. The returned function has an interface of: `function(err, res, body)`.
    //
    // successStatuses, required, number or array of numbers
    // successRootKeys, required, string or array of strings
    // callback, required, function
    /** @private */
    Client.prototype._buildRequestPromiseHandler = function(requestOptions, successStatuses, successRootKeys, resolve, reject) {
      if (typeof successStatuses === 'number') {
        successStatuses = [successStatuses];
      }

      if (typeof successRootKeys === 'string') {
        successRootKeys = [successRootKeys];
      }

      var self = this;
      var Promise = this.promise;
      return function(err, res, body) {
        if (err) {
          return reject(err);
        }

        // Handle errors on DO's side (5xx level)
        var statusCodeLevel = Math.floor(res.statusCode / 100);
        if (statusCodeLevel === 5) {
          return reject(new DigitalOceanError('Error ' + res.statusCode, res.statusCode, res.headers));
        }

        // Handle improperly returned reponses (e.g. html or something else bizarre)
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body || '{}');
          } catch (jsonParseError) {
            return reject(jsonParseError);
          }
        }

        // Handle validation errors (4xx level)
        if (body.message && statusCodeLevel === 4) {
          return reject(new DigitalOceanError(body.message, res.statusCode, res.headers, body));
        }

        // Handle an unexpcted response code
        if (successStatuses.indexOf(res.statusCode) < 0) {
          return reject(new Error('Unexpected reponse code: ' + res.statusCode));
        }

        // Find the first key from the body object in successRootKeys
        var data = {};
        for (var i = 0; i < successRootKeys.length; i++) {
          var key = successRootKeys[i];
          if (body[key]) {
            data = body[key];
            break;
          }
        }

        // If body.meta.total exists, then it's a paginated response
        var result;
        if (body.meta && body.meta.total) {
          result = new util.ListResponse(self, data, body.meta.total, requestOptions, successStatuses, successRootKeys, Promise);
        } else {
          result = data;
        }

        // Append response data under a special key in the object
        result._digitalOcean = {
          statusCode: res.statusCode,
          body: body,
          headers: res.headers
        };

        return resolve(result);
      };
    };

    /** @private */
    Client.prototype._callbackOrPromise = function(options, overrideOptions, successStatuses, successRootKeys, callback) {
      // Use a hierarchy of options to provide overrides:
      //  1. this.requestDefaults (specified by client)
      //  2. this.requestOptions  (specified by user at client initialization)
      //  3. options              (specfied by client per call type)
      //  4. overrideOptions      (specified by user at call time)
      var requestOptions = deepExtend(this.requestDefaults, this.requestOptions, options, overrideOptions);

      var self = this;
      var deferred = new this.promise(function(resolve, reject) {
        self.request(
          requestOptions,
          self._buildRequestPromiseHandler.apply(self, [requestOptions, successStatuses, successRootKeys, resolve, reject])
        );
      });

      if (callback) {
        // If a callback is provided, translate it to a Promise (to ensure
        // it's called outside of the promise stack, call via timeout)
        deferred
          .then(function(response) {
            setTimeout(function() {
              callback(
                null,
                response,
                response._digitalOcean.headers,
                response._digitalOcean.body
              );
            }, 0);
          })
          .catch(function(error) {
            setTimeout(function() {
              callback(error);
            }, 0);
          });
      }

      return deferred;
    };

    /**
     * Send a HTTP GET request with the specified parameters.
     *
     * @param {string} path - the URL escaped route
     * @param {object} options - an object passed to the request library  See the {@link https://github.com/request/request#requestoptions-callback|request docs} for valid attributes, e.g. a proxy or user agent
     * @param {(number|object)} [page or queryObject] - page number to retrieve or key value pairs of query parameters
     * @param {number} [perPage] - number of result per page to retrieve
     * @param {number|number[]} successStatuses - number or array of numbers corresponding to successful HTTP status codes
     * @param {string|string[]} successRootKeys - string or array of strings corresponding to the root objects containing successful responses
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Client
     */
    Client.prototype.get = function() {
      var i;
      var path = arguments[0],
          options = arguments[1],
          params = 4 <= arguments.length ? slice.call(arguments, 2, i = arguments.length - 3) : (i = 2, []),
          successStatuses = arguments[i++],
          successRootKeys = arguments[i++],
          callback = arguments[i++];

      var pageOrQuery = params[0],
          perPage = params[1],
          query = null;
      if ((pageOrQuery != null) && typeof pageOrQuery === 'object') {
        query = pageOrQuery;
      } else {
        query = {};
        if (pageOrQuery != null) {
          query.page = pageOrQuery;
        }
        if (perPage != null) {
          query.per_page = perPage;
        }
      }

      return this._callbackOrPromise(
        {
          uri: this._buildUrl(path, query),
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + this.token
          },
          query: query,
          path: path,
        },
        options,
        successStatuses,
        successRootKeys,
        callback
      );
    };

    /** @private */
    Client.prototype._makeRequestWithBody = function(type, path, content, options, successStatuses, successRootKeys, callback) {
      // if `options` isn't passed, shift arguments back by one and set
      // default hash for options
      if (callback == null && (successRootKeys == null || typeof successRootKeys === 'function')) {
        callback = successRootKeys;
        successRootKeys = successStatuses;
        successStatuses = options;
        options = {};
      }

      if (!!this.decamelizeKeys) {
        content = util.decamelizeKeys(content);
      }

      return this._callbackOrPromise(
        {
          uri: this._buildUrl(path, options.query),
          method: type,
          headers: {
            'Authorization': 'Bearer ' + this.token
          },
          body: JSON.stringify(content)
        },
        options,
        successStatuses,
        successRootKeys,
        callback
      );
    };


    /**
     * Send a HTTP POST request with the specified parameters.
     *
     * @param {string} path - the URL escaped route
     * @param {object} content - an object serialized to json
     * @param {object} options - an object passed to the request library  See the {@link https://github.com/request/request#requestoptions-callback|request docs} for valid attributes, e.g. a proxy or user agent
     * @param {number|number[]} successStatuses - number or array of numbers corresponding to successful HTTP status codes
     * @param {string|string[]} successRootKeys - string or array of strings corresponding to the root objects containing successful responses
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Client
     */
    Client.prototype.post = function(path, content, options, successStatuses, successRootKeys, callback) {
      return this._makeRequestWithBody('POST', path, content, options, successStatuses, successRootKeys, callback);
    };

    /**
     * Send a HTTP PATCH request with the specified parameters.
     *
     * @param {string} path - the URL escaped route
     * @param {object} content - an object serialized to json
     * @param {object} options - an object passed to the request library  See the {@link https://github.com/request/request#requestoptions-callback|request docs} for valid attributes, e.g. a proxy or user agent
     * @param {number|number[]} successStatuses - number or array of numbers corresponding to successful HTTP status codes
     * @param {string|string[]} successRootKeys - string or array of strings corresponding to the root objects containing successful responses
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Client
     */
    Client.prototype.patch = function(path, content, options, successStatuses, successRootKeys, callback) {
      return this._makeRequestWithBody('PATCH', path, content, options, successStatuses, successRootKeys, callback);
    };

    /**
     * Send a HTTP PUT request with the specified parameters.
     *
     * @param {string} path - the URL escaped route
     * @param {object} content - an object serialized to json
     * @param {object} options - an object passed to the request library  See the {@link https://github.com/request/request#requestoptions-callback|request docs} for valid attributes, e.g. a proxy or user agent
     * @param {number|number[]} successStatuses - number or array of numbers corresponding to successful HTTP status codes
     * @param {string|string[]} successRootKeys - string or array of strings corresponding to the root objects containing successful responses
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Client
     */
    Client.prototype.put = function(path, content, options, successStatuses, successRootKeys, callback) {
      return this._makeRequestWithBody('PUT', path, content, options, successStatuses, successRootKeys, callback);
    };

    /**
     * Send a HTTP DELETE request with the specified parameters.
     *
     * @param {string} path - the URL escaped route
     * @param {object} content - an object serialized to json
     * @param {object} options - an object passed to the request library  See the {@link https://github.com/request/request#requestoptions-callback|request docs} for valid attributes, e.g. a proxy or user agent
     * @param {number|number[]} successStatuses - number or array of numbers corresponding to successful HTTP status codes
     * @param {string|string[]} successRootKeys - string or array of strings corresponding to the root objects containing successful responses
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Client
     */
    Client.prototype.delete = function(path, content, options, successStatuses, successRootKeys, callback) {
      return this._makeRequestWithBody('DELETE', path, content, options, successStatuses, successRootKeys, callback);
    };

    return Client;
  })();

  module.exports = function(token, options) {
    return new Client(token, options);
  };
}).call(this);
