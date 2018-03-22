# digitalocean-node

[![Build Status](https://travis-ci.org/phillbaker/digitalocean-node.svg?branch=master)](https://travis-ci.org/phillbaker/digitalocean-node)
[![Dependencies](https://david-dm.org/phillbaker/digitalocean-node.svg)](https://www.npmjs.com/package/digitalocean)
[![Downloads](https://img.shields.io/npm/dm/digitalocean.svg)](https://www.npmjs.com/package/digitalocean)

digitalocean-node is a library for nodejs to access the [DigitalOcean v2 API](https://developers.digitalocean.com/documentation/v2/).

## Installation
```
npm install digitalocean --save
```

## Usage

Every resource is accessed via an instance of the client. Please [chose one of your tokens](https://cloud.digitalocean.com/settings/api/tokens) and use that where ever `TOKEN` is referenced. For example:

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN'); // See
// client.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource method accepts an optional callback as the last argument. For example:

```js
client.account.get(function(err, account) {
  console.log(err); // null on success
  console.log(account); //
});
```

See below [for more options in the callback](#api-callback-structure).

Resource methods also return a [promise](https://promisesaplus.com/). For example:

```js
client.droplets.list().then(function(droplets) {
  var droplet = droplets[0];
  return client.droplets.snapshot(droplet.id);
}).then(function() {
  console.log("created a snapshot of a Droplet!");
}).catch(function(err) {
  // Deal with an error
});
```

[All resources and actions](#all-resources-and-actions) are listed below, however, the general structure of the client follows the following pattern:

```js
client.droplets.list(callback);
client.droplets.create(options, callback);
client.droplets.get(123, callback);
client.droplets.delete(123, callback);
client.droplets.powerOff(123, callback);
client.droplets.getAction(123, 456, callback);
```

### Spaces support

[DigitalOcean's Spaces](https://developers.digitalocean.com/documentation/spaces/) is an S3-compatible object storage service. The API for spaces is a different schema at a different abstraction level (XML and actual file objects) than the normal "control" API. The good news is that it's interopable with lots of existing S3 clients, [this is a node one](https://github.com/andrewrk/node-s3-client).

You should be able to use Spaces similarly to:

```
var s3 = require('s3');

var client = s3.createClient({
  s3Options: {
    accessKeyId: "your spaces key from https://cloud.digitalocean.com/settings/api/tokens",
    secretAccessKey: "your spaces secret from https://cloud.digitalocean.com/settings/api/tokens",
    region: "nyc3",
    endpoint: 'nyc3.digitaloceanspaces.com',
  },
});
```

## Client Options

The DigitalOcean client depends on [`request`](https://github.com/request/request), and [options can be passed through](https://github.com/request/request#requestoptions-callback) (e.g. a proxy or user agent). For example:

```js
var client = digitalocean.client('TOKEN', {
  request: myInitializedRequestObject,
  requestOptions: {
    proxy: 'https://myproxy.com:1085',
    headers: {
      'User-Agent': 'foo'
    }
  }
});
```

Other options include:

```js
var client = digitalocean.client('TOKEN', {
  promise: MySpecialPromiseVersion, // defaults to Promise
  decamelizeKeys: false // defaults to true
});
```

### Using a client with an access token

```js
var client = digitalocean.client('TOKEN');

client.get('/account', {}, 200, 'account', function (err, status, body, headers) {
  console.log(body); //json object
});
```

## Callback function signature

All callbacks will be passed:
1. an error (null if no error occurred)
1. a resource object
1. the response headers
1. the raw response body

For example:

```js
client.account.get(function(err, account, headers, response) {
  console.log("error: " + err);
  console.log("account: " + account);
  console.log("headers: " + headers);
  console.log("response: " + response);
});
```

## Promise result

Promise results are the resource(s) returned by a successful response - a list response object, an individual object, or a blank object (for successful empty responses such as deletes). These objects have a special property, `_digitalOcean` that includes response information. For example:

```js
// ...
.then(function(object) {
  console.log(object); // =>
  // {
  //   _digitalOcean: {
  //     statusCode: 204,
  //     body: {},
  //     headers: {}
  //   }
  // }
})
```

## Pagination

### Auto pagination

Although the DigitalOcean API returns results from query endpoints in [pages](https://developers.digitalocean.com/documentation/v2/#links), this client abstracts that notion by lazily fetching subsequent pages when they are needed. This allows developers to easily handles fetching large lists of resources without having to manually paginate results and perform subsequent requests - adding a layer of convenience on top of what is a common limitation in REST based APIs. An example of using this is:

```js
client.droplets.list(function(err, droplets) {
  if (err) {
    return console.error('Error fetching pages', err);
  }

  droplets.all(function(err, droplet) {
    console.log(err, droplet);
  });

  var error = iterator.error()
  if (error) {
    console.log(error);
  }
});
```

Note that the magic `.length` property on `ListResponse` is tied to the first page of results.

```js
client.droplets.list(function(err, droplets) {
  if (err) {
    return console.error('Error fetching pages', err);
  }

  // Limited to original page only:
  for (var i = 0, len = droplets.length; i < len; i++) {
    console.log(droplets[i]);
  }
});
```

Under the hood, this enumeration is handled by an iterator object, this can be accessed as well (it uses promises internally):

```js
client.droplets.list(function(err, droplets) {
  if (err) {
    return console.error('Error fetching pages', err);
  }

  var iterator = droplets.iterator();
  var iterable = iterator.next();
  while(!iterable.done) {
    iterable.value.then(function(value) {
      console.log(value);
      iterable = iterator.next();
    });
  }

  // Check the error afterwards:
  var error = iterator.error()
  if (error) {
    console.log(error);
  }
});
```

### Pagination parameters

If a function declares pagination parameters, then results from the function are arranged in [pages](https://developers.digitalocean.com/documentation/v2/#links). These arguments are:

The `page` argument is optional and is used to specify which page of objects to retrieve.
The `perPage` argument is also optional and is used to specify how many objects per page.

```js
// Normal usage of function
client.droplets.list(callback); // Callback receives an array of first 25 issues

// Using pagination parameters
client.droplets.list(2, 100, callback); // Callback receives an array of second 100 issues
client.droplets.list(10, callback); // Callback receives an array of 25 issues from page 10

// Pagination parameters can be set with query object too
client.droplets.list({
  page: 2,
  per_page: 100
}, callback); //array of second 100 issues which are closed
```

### Pagination examples

To fetch all the pages of a resource, the pages must be traversed. For example, to fetch all Droplets:

```js
getAllDroplets(function(allDroplets) {
  console.log(allDroplets.length);
});

function getAllDroplets(callback, page, array) {
  client.droplets.list(page, function(err, droplets, _, response) {
    if (err) {
      return console.error('Error fetching pages', err);
    }

    if (page == null) {
      page = 1;
    }
    if (array == null) {
      array = [];
    }
    array = array.concat(droplets);

    // has no pages or has pages and has no last page
    var isLastPage = response['links'] && (
      !response['links']['pages'] ||
        (response['links']['pages'] && response['links']['pages']['last'] === undefined)
    );
    if (!err && isLastPage) {
      callback.call(this, array);
    } else if (!err && !isLastPage) {
      getAllDroplets(callback, page + 1, array);
    } else {
      // whoops, try again
      getAllDroplets(callback, page, array);
    }
  });
};
```

Or Promise style:

```
getAllDroplets().then(function(allDroplets) {
  console.log(allDroplets);
}).catch(function(err) {
  console.log(err);
});

function getAllDroplets() {
  var allDroplets = [];

  function getDropletPage(page) {
    if (page == null) {
      page = 1;
    }

    return client.droplets.list(page)
      .each(function(droplet) {
        allDroplets.push(droplet);
      })
      .then(function(droplets) {
        var links = droplets._digitalocean.body.links;
        var isLastPage = links && (
          !links.pages ||
            (links.pages && links.pages.last === undefined)
        );

        if (isLastPage) {
          return allDroplets;
        } else {
          return getDropletPage(page + 1);
        }
      });
  }

  return getDropletPage();
}
```

## Rate Limiting

You can also check your rate limit status by calling the following.

```js
client.droplets.list(function (err, account, headers, response) {
  console.log(headers['ratelimit-remaining']); // 4999
  console.log(headers['ratelimit-limit']);  // 5000
  console.log(headers['ratelimit-reset']);  // Time in Unix Epoch, e.g. 1415984218
});
```

## Usage in the Browser

This library is also available as a single file built for usage in the browser at `dist/digitalocean.js`. It uses [browserify](http://browserify.org/) to package all dependencies and output the built file. This file is updated and released to [Bower](https://bower.io) for each release with the same version.


For example, using the built file at `dist/digitalocean.js`:
```html
<html>
  <head></head>
  <body>
    <script src="dist/digitalocean.js"></script>
    <script>
      var client = digitalocean.client('TOKEN');

      client.account.get(function(_, account) {
        console.log(account.uuid);
      });
    </script>
  </body>
</html>
```

## All Resources and Actions

*Where you see `attributes` it is a plain JavaScript object, e.g. `{ email: 'foo@example.com' }`*

### Droplet resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.droplets
```

* `client.droplets.list([page, perPage,] [callback])`
* `client.droplets.list([queryObject,] [callback])`
* `client.droplets.get(droplet.id, [callback])`
* `client.droplets.create(attributes, [callback])`
* `client.droplets.delete(droplet.id, [callback])`
* `client.droplets.deleteByTag(tag.name, [callback])`
* `client.droplets.kernels(droplet.id, [page, perPage,] [callback])`
* `client.droplets.kernels(droplet.id, [queryObject,] [callback])`
* `client.droplets.snapshots(droplet.id, [page, perPage,] [callback])`
* `client.droplets.snapshots(droplet.id, [queryObject,] [callback])`
* `client.droplets.backups(droplet.id, [page, perPage,] [callback])`
* `client.droplets.backups(droplet.id, [queryObject,] [callback])`
* `client.droplets.neighbors(droplet.id, [page, perPage,] [callback])`
* `client.droplets.neighbors(droplet.id, [queryObject,] [callback])`
* `client.droplets.listActions(droplet.id, [page, perPage,] [callback])`
* `client.droplets.listActions(droplet.id, [queryObject,] [callback])`
* `client.droplets.getAction(droplet.id, action.id, [callback])`

For the latest valid attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#droplets).

Methods resulting in an `action`:

* `client.droplets.actionByTag(tag.name, actionType, [callback])`
* `client.droplets.reboot(droplet.id, [callback])`
* `client.droplets.powerCycle(droplet.id, [callback])`
* `client.droplets.shutdown(droplet.id, [callback])`
* `client.droplets.powerOff(droplet.id, [callback])`
* `client.droplets.powerOn(droplet.id, [callback])`
* `client.droplets.passwordReset(droplet.id, [callback])`
* `client.droplets.enableIpv6(droplet.id, [callback])`
* `client.droplets.enableBackups(droplet.id, [callback])`
* `client.droplets.disableBackups(droplet.id, [callback])`
* `client.droplets.enablePrivateNetworking(droplet.id, [callback])`
* `client.droplets.snapshot(droplet.id, parametersOrName, [callback])`
* `client.droplets.changeKernel(droplet.id, parametersOrKernelId, [callback])`
* `client.droplets.rename(droplet.id, parametersOrHostname, [callback])`
* `client.droplets.rebuild(droplet.id, parametersOrImage, [callback])`
* `client.droplets.restore(droplet.id, parametersOrImageId, [callback])`
* `client.droplets.resize(droplet.id, parametersOrSizeSlug, [callback])`

### Drive resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.drives
```

* `client.drives.list([page, perPage,] [callback])`
* `client.drives.list([queryObject,] [callback])`

[See the official docs](https://developers.digitalocean.com/documentation/v2/block-storage-beta/#retrieve-an-existing-block-storage-drive-by-name) on different parameters to pass via the query object to filter the drives.

* `client.drives.get(tag.name, [callback])`
* `client.drives.create(attributes, [callback])`

For the latest valid attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/block-storage-beta/#create-a-new-block-storage-drive).

* `client.drives.delete(tag.name, [callback])`

Methods resulting in an `action`:

* `client.drives.attach(drive.id, parametersOrDropletId, [callback])`
* `client.drives.detach(drive.id, [callback])`
* `client.drives.listActions(drive.id, [page, perPage,] [callback])`
* `client.drives.listActions(drive.id, [queryObject,] [callback])`
* `client.drives.getAction(drive.id, action.id, [callback])`

### Domain resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.domains
```

* `client.domains.list([page, perPage,] [callback])`
* `client.domains.list([queryObject,] [callback])`
* `client.domains.create(attributes, [callback])`
* `client.domains.get(domain.name, [callback])`
* `client.domains.delete(domain.name, [callback])`
* `client.domains.listRecords([page, perPage,] domain.name, [callback])`
* `client.domains.listRecords([queryObject,] domain.name, [callback])`
* `client.domains.createRecord(domain.name, attributes, [callback])`
* `client.domains.getRecord(domain.name, domainRecord.id, [callback])`
* `client.domains.deleteRecord(domain.name, domainRecord.id, [callback])`
* `client.domains.updateRecord(domain.name, domainRecord.id,, attributes, [callback])`

For the latest valid domain attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#domains). For the latest valid domain record attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#domain-records).


### Image resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.images
```

* `client.images.list([page, perPage,] [callback])`
* `client.images.list([queryObject,] [callback])`

[See the official docs](https://developers.digitalocean.com/documentation/v2/#list-all-distribution-images) on different parameters to pass via the query object to filter the images.

* `client.images.get(image.id, [callback])`
* `client.images.delete(image.id, [callback])`
* `client.images.update(image.id, attributes, [callback])`
* `client.image.listActions([page, perPage,] image.id, [callback])`
* `client.image.listActions([queryObject,] image.id, [callback])`
* `client.image.getAction(image.id, action.id, [callback])`

Methods resulting in an `action`:

* `client.image.transfer(image.id, parametersOrRegionSlug, [callback])`
* `client.image.convert(image.id, [callback])`


### Region resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.regions
```

* `client.regions.list([callback])`


### Size resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.sizes
```

* `client.sizes.list([callback])`

### Snapshot resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.snapshots
```

* `client.snapshots.list([page, perPage,] [callback])`
* `client.snapshots.list([queryObject,] [callback])`
* `client.snapshots.get(snapshots.id, [callback])`
* `client.snapshots.delete(snapshot.id, [callback])`

### Account resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.account
```

* `client.account.get([callback])`
* `client.account.listSshKeys([page, perPage,] [callback])`
* `client.account.listSshKeys([queryObject,] [callback])`
* `client.account.createSshKey(attributes, [callback])`
* `client.account.getSshKey(sshKey.id, [callback])`
* `client.account.deleteSshKey(sshKey.id, [callback])`
* `client.account.updateSshKey(sshKey.id, attributes, [callback])`

For the latest ssh key valid attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#ssh-keys).

### Floating IP resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.floatingIps
```

* `client.floatingIps.list([page, perPage,] [callback])`
* `client.floatingIps.list([queryObject,] [callback])`
* `client.floatingIps.get(floatingIp.ip, [callback])`
* `client.floatingIps.create(attributes, [callback])`
* `client.floatingIps.delete(floatingIp.ip, [callback])`
* `client.floatingIps.listActions([page, perPage,] [callback])`
* `client.floatingIps.listActions([queryObject,] [callback])`
* `client.floatingIps.getAction(floatingIp.ip, [callback])`

For the latest valid attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#floating-ips).

Methods resulting in an `action`:

* `client.floatingIps.assign(floatingIp.ip, parametersOrDropletId, [callback])`
* `client.floatingIps.unassign(floatingIp.ip, [callback])`

### Volume resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.volumes
```

* `client.volumes.list([page, perPage,] [callback])`
* `client.volumes.list([queryObject,] [callback])`
* `client.volumes.get(volume.id, [callback])`
* `client.volumes.create(attributes, [callback])`
* `client.volumes.delete(volume.id, [callback])`
* `client.volumes.listActions([page, perPage,] [callback])`
* `client.volumes.listActions([queryObject,] [callback])`
* `client.volumes.getAction(volume.id, action.id, [callback])`

For the latest valid attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#volumes).

Methods resulting in an `action`:

* `client.volumes.attach(volume.id, parametersOrDropletId, [callback])`
* `client.volumes.detach(volume.id, [callback])`
* `client.volumes.resize(volume.id, parametersOrSizeGibabytes, region, [callback])`

### Tag resource

```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.tags
```

* `client.tags.list([page, perPage,] [callback])`
* `client.tags.list([queryObject,] [callback])`
* `client.tags.get(tag.name, [callback])`
* `client.tags.create(attributes, [callback])`
* `client.tags.update(tag.name, attributes, [callback])`
* `client.tags.tag(tag.name, [{resource_id: , resource_type: }], [callback])`
* `client.tags.untag(tag.name, [{resource_id: , resource_type: }], [callback])`
* `client.tags.delete(tag.name, [callback])`

For the latest valid attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#tags).

### Certificate resource
```js
var digitalocean = require('digitalocean');
var client = digitalocean.client('TOKEN');
client.certificates
```

* `client.certificates.list([page, perPage], [callback])`
* `client.certificates.list([queryObject], [callback])`
* `client.certificates.get(certificate.id, [callback])`
* `client.certificates.create(attributes, [callback])`
* `client.certificates.delete(certificate.id, [callback])`

For the latest valid attributes, [see the official docs](https://developers.digitalocean.com/documentation/v2/#certificates).

## Contributing

1. Fork it ( https://github.com/phillbaker/digitalocean-node/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Testing

```
npm test
```

## Releasing

Run:

```sh
npm run release:patch # or release:minor or release:major depending on the type of version bump
```

## License

MIT

## Inspiration

Based on the work of @pksunkara in [octonode](https://github.com/pksunkara/octonode).
