(function() {
  var slice = [].slice;

  module.exports.safeUrl = function() {
    var args = slice.call(arguments);
    return args.reduce(function(accum, fragment) {
      return accum + '/' + encodeURIComponent(fragment);
    }, '');
  };

  // Based on Humps by Dom Christie
  var decamelizeKeys = function(object) {
    // if we're not an array or object, return the primative
    if (object !== Object(object)) {
      return object;
    }

    var decamelizeString = function(string) {
      var separator = '_';
      var split = /(?=[A-Z])/;

      return string.split(split).join(separator).toLowerCase();
    };


    var output;
    if (object instanceof Array) {
      output = [];
      for(var i = 0, l = object.length; i < l; i++) {
        output.push(decamelizeKeys(object[i]));
      }
    } else {
      output = {};
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          output[decamelizeString(key)] = decamelizeKeys(object[key]);
        }
      }
    }

    return output;
  };
  module.exports.decamelizeKeys = decamelizeKeys;

  module.exports.extractListArguments = function(args, countPrependedArgs) {
    var startIndex, endIndex, id, params, callback;

    var hasCallback = typeof(args[args.length - 1]) === 'function';

    startIndex = countPrependedArgs;
    if (args.length > 0) {
      endIndex = args.length;
      if (hasCallback) {
        endIndex -= 1;
      }
      params = slice.call(args, startIndex, endIndex);
    } else {
      endIndex = countPrependedArgs;
      params = [];
    }

    if (countPrependedArgs > 0) {
      id = args[0];
    }

    if (hasCallback) {
      callback = args[args.length - 1];
    }

    return {
      identifier: id,
      callback: callback,
      params: params
    };
  };

  /**
   * A class that runs the pagination until the end if necessary.
   *
   * @class ListResponse
   */
  var ListResponse = function(client, initialData, totalLength, requestOptions, successStatuses, successRootKeys, promise) {
    this.currentPage = 1; // default to start at page 1
    // this.perPage = queryParams && queryParams.per_page || 25; // default to 25 per page
    this.totalLength = totalLength;
    // bootstrap with initial data
    this.push.apply(this, initialData);

    this.client = client;
    this.requestOptions = requestOptions;
    this.successStatuses = successStatuses;
    this.successRootKeys = successRootKeys;
    this.promise = promise;
  };
  ListResponse.prototype = Object.create(Array.prototype);

  ListResponse.prototype.concat = function() {
    // not sure why concat doesn't like the subclass, but treats it as an
    // object
    return [].concat.apply(this.slice(0), arguments);
  };

  ListResponse.prototype.all = function(callback) {
    var iterator = this.iterator();
    var iterable = iterator.next();

    var handleNext = function(value) {
      if (callback) {
        setTimeout(function() {
          callback(null, value);
        }, 0);
      }
      iterable = iterator.next();

      // "recurse"
      if (!iterable.done) {
        iterable.value.then(handleNext).catch(handleError);
      }
    };
    var handleError = function(error) {
      if (callback) {
        setTimeout(function() {
          callback(error, null);
        }, 0);
      }
    };

    iterable.value.then(handleNext).catch(handleError);
  };

  /**
   * Implement the iterator protocol. Return an object that responds to next()
   * with two properties: a boolean `done` and `value` with the result of that iteration, which is a promise in this case.
   */
  ListResponse.prototype.iterator = function() {
    var totalIterated = 0;
    var self = this;
    var Promise = this.promise;
    return {
      next: function() {
        if (totalIterated < self.totalLength) {
          var deferred;
          if (totalIterated >= self.length) {
            // Fetch next page
            deferred = self.nextPage().then(function(page) {
              [].push.apply(self, page.slice(0));
            });
          } else {
            deferred = new Promise(function(resolve) {
              return resolve(1);
            });
          }

          deferred = deferred.then(function() {
            var value = self[totalIterated];
            totalIterated += 1;
            return value;
          });

          return {
            value: deferred,
            done: false
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
  };

  // returns a promise
  ListResponse.prototype.nextPage = function() {
    this.currentPage += 1;
    var params = Object.assign({}, this.requestOptions.query);
    params.page = this.currentPage;

    var promise = this.client.get(
      this.requestOptions.path,
      this.requestOptions,
      params,
      this.successStatuses,
      this.successRootKeys,
      false
    );

    return promise;
  };

  module.exports.ListResponse = ListResponse;
}).call(this);
