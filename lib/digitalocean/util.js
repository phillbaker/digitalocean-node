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
}).call(this);
