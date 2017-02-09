'use strict';

var expect = require('chai').expect;

var testUtils = require('../testUtils');

var digitalocean = require('../../lib/digitalocean');
var token = testUtils.getUserDigitalOceanToken();
var client = digitalocean.client(token);

describe('volume endpoints', function() {
  describe('list', function() {
    var data = {
      "volumes": [
        {
          "id": "506f78a4-e098-11e5-ad9f-000f53306ae1",
          "region": {
            "name": "New York 1",
            "slug": "nyc1",
            "sizes": [
              "512mb",
              "1gb",
              "2gb",
              "4gb",
              "8gb",
              "16gb",
              "32gb",
              "48gb",
              "64gb"
            ],
            "features": [
              "private_networking",
              "backups",
              "ipv6",
              "metadata"
            ],
            "available": true
          },
          "droplet_ids": [],
          "name": "example",
          "description": "Block store for examples",
          "size_gigabytes": 10,
          "created_at": "2016-03-02T17:00:49Z"
        }
      ],
      "links": {
      },
      "meta": {
        "total": 1
      }
    };

    it('returns volume', function() {
      testUtils.api.get('/v2/volumes').reply(200, JSON.stringify(data));

      client.volumes.list(function(err, volumes, headers) {
        expect(volumes).to.shallowDeepEqual(data.volumes);
      });
    });

    it('returns volume at page', function() {
      testUtils.api.get('/v2/volumes?page=2').reply(200, JSON.stringify(data));

      client.volumes.list(2, function(err, volumes, headers) {
        expect(volumes).to.shallowDeepEqual(data.volumes);
      });
    });

    it('returns volume at page with length', function() {
      testUtils.api.get('/v2/volumes?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.list(2, 1, function(err, volumes, headers) {
        expect(volumes).to.shallowDeepEqual(data.volumes);
      });
    });

    it('returns volumes with a query object', function() {
      testUtils.api.get('/v2/volumes?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.list({ page: 2, per_page: 1 }, function(err, volumes, headers) {
        expect(volumes).to.shallowDeepEqual(data.volumes);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/volumes').reply(200, JSON.stringify(data));

      client.volumes.list().then(function(volumes) {
        expect(volumes).to.shallowDeepEqual(data.volumes);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('returns a promisable with a query object', function(done) {
      testUtils.api.get('/v2/volumes?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.list({ page: 2, per_page: 1 }).then(function(volumes) {
        expect(volumes).to.shallowDeepEqual(data.volumes);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('create', function() {
    var data = {
      "volume": {
        "id": "506f78a4-e098-11e5-ad9f-000f53306ae1",
        "region": {
          "name": "New York 1",
          "slug": "nyc1",
          "sizes": [
            "512mb",
            "1gb",
            "2gb",
            "4gb",
            "8gb",
            "16gb",
            "32gb",
            "48gb",
            "64gb"
          ],
          "features": [
            "private_networking",
            "backups",
            "ipv6",
            "metadata"
          ],
          "available": true
        },
        "droplet_ids": [

        ],
        "name": "example",
        "description": "Block store for examples",
        "size_gigabytes": 10,
        "created_at": "2016-03-02T17:00:49Z"
      }
    };
    var attributes = {
      "size_gigabytes": 10,
      "name": "example",
      "description": "Block store for examples",
      "region": "nyc1"
    };

    it('creates the volume', function() {
      testUtils.api.post('/v2/volumes', attributes).reply(201, data);

      client.volumes.create(attributes, function(err, volume, headers) {
        expect(volume).to.shallowDeepEqual(data.volume);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/volumes', attributes).reply(201, data);

      client.volumes.create(attributes).then(function(volume) {
        expect(volume).to.shallowDeepEqual(data.volume);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('snapshot', function() {
    var data = {
      "snapshot": {
        "id": "7724db7c-e098-11e5-b522-000f53304e51",
        "name": "Ubuntu Foo",
        "regions": [
          "nyc1"
        ],
        "created_at": "2014-07-29T14:35:40Z",
        "resource_type": "volume",
        "resource_id": "7724db7c-e098-11e5-b522-000f53304e51",
        "min_disk_size": 10,
        "size_gigabytes": 0.4
      }
    };
    var attributes = {
      "name": "name"
    };

    it('creates the volume', function() {
      testUtils.api.post('/v2/volumes/7724db7c-e098-11e5-b522-000f53304e51/snapshots', attributes).reply(201, data);

      client.volumes.snapshot("7724db7c-e098-11e5-b522-000f53304e51", "name", function(err, snapshot, headers) {
        expect(snapshot).to.shallowDeepEqual(data.snapshot);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/volumes/7724db7c-e098-11e5-b522-000f53304e51/snapshots', attributes).reply(201, data);

      client.volumes.snapshot("7724db7c-e098-11e5-b522-000f53304e51", attributes).then(function(snapshot) {
        expect(snapshot).to.shallowDeepEqual(data.snapshot);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('snapshots', function() {
    var data = {
      "snapshots": [
        {
          "id": "7724db7c-e098-11e5-b522-000f53304e51",
          "name": "Ubuntu Foo",
          "regions": [
            "nyc1"
          ],
          "created_at": "2014-07-29T14:35:40Z",
          "resource_type": "volume",
          "resource_id": "123",
          "min_disk_size": 10,
          "size_gigabytes": 0.4
        }
      ],
      "links": {
      },
      "meta": {
        "total": 1
      }
    };

    it('returns snapshot', function() {
      testUtils.api.get('/v2/volumes/123/snapshots').reply(200, JSON.stringify(data));

      client.volumes.snapshots("123", function(err, snapshots, headers) {
        expect(snapshots).to.shallowDeepEqual(data.snapshots);
      });
    });

    it('returns snapshot at page', function() {
      testUtils.api.get('/v2/volumes/123/snapshots?page=2').reply(200, JSON.stringify(data));

      client.volumes.snapshots("123", 2, function(err, snapshots, headers) {
        expect(snapshots).to.shallowDeepEqual(data.snapshots);
      });
    });

    it('returns snapshot at page with length', function() {
      testUtils.api.get('/v2/volumes/123/snapshots?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.snapshots("123", 2, 1, function(err, snapshots, headers) {
        expect(snapshots).to.shallowDeepEqual(data.snapshots);
      });
    });

    it('returns snapshots with a query object', function() {
      testUtils.api.get('/v2/volumes/123/snapshots?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.snapshots("123", { page: 2, per_page: 1 }, function(err, snapshots, headers) {
        expect(snapshots).to.shallowDeepEqual(data.snapshots);
      });
    });

    it('escapes the name', function() {
      testUtils.api.get('/v2/volumes/foo%2Fbar/snapshots').reply(200, JSON.stringify(data));

      client.volumes.snapshots("foo/bar", function(err, snapshots, headers) {
        expect(snapshots).to.shallowDeepEqual(data.snapshots);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/volumes/123/snapshots').reply(200, JSON.stringify(data));

      client.volumes.snapshots("123").then(function(snapshots) {
        expect(snapshots).to.shallowDeepEqual(data.snapshots);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('returns a promisable with a query object', function(done) {
      testUtils.api.get('/v2/volumes/123/snapshots?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.snapshots("123", { page: 2, per_page: 1 }).then(function(snapshots) {
        expect(snapshots).to.shallowDeepEqual(data.snapshots);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('get', function() {
    var data = {
      "volume": {
        "id": "506f78a4-e098-11e5-ad9f-000f53306ae1",
        "region": {
          "name": "New York 1",
          "slug": "nyc1",
          "sizes": [
            "512mb",
            "1gb",
            "2gb",
            "4gb",
            "8gb",
            "16gb",
            "32gb",
            "48gb",
            "64gb"
          ],
          "features": [
            "private_networking",
            "backups",
            "ipv6",
            "metadata"
          ],
          "available": true
        },
        "droplet_ids": [

        ],
        "name": "example",
        "description": "Block store for examples",
        "size_gigabytes": 10,
        "created_at": "2016-03-02T17:00:49Z"
      }
    };

    it('returns the volume', function() {
      testUtils.api.get('/v2/volumes/123').reply(200, JSON.stringify(data));

      client.volumes.get(123, function(err, volume, headers) {
        expect(volume).to.shallowDeepEqual(data.volume);
      });
    });

    it('escapes the name', function() {
      testUtils.api.get('/v2/volumes/foo%2Fbar').reply(200, JSON.stringify(data));

      client.volumes.get('foo/bar', function(err, volume, headers) {
        expect(volume).to.shallowDeepEqual(data.volume);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/volumes/123').reply(200, JSON.stringify(data));

      client.volumes.get(123).then(function(volume) {
        expect(volume).to.shallowDeepEqual(data.volume);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('delete', function() {
    it('deletes the droplet', function() {
      testUtils.api.delete('/v2/volumes/123').reply(204, '');

      client.volumes.delete(123, function(err) {
        expect(err).to.be.null;
      });
    });

    it('deletes the droplet', function() {
      testUtils.api.delete('/v2/volumes?name=abc&region=nyc1').reply(204, '');

      client.volumes.delete({ name: 'abc', region: 'nyc1' }, function(err) {
        expect(err).to.be.null;
      });
    })

    it('escapes the name', function() {
      testUtils.api.delete('/v2/volumes/foo%2Fbar').reply(204, '');

      client.volumes.delete('foo/bar', function(err) {
        expect(err).to.be.null;
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.delete('/v2/volumes/123').reply(204, '');

      client.volumes.delete(123).then(function(volume) {
        expect(volume.ip).to.be.undefined;
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('list actions', function() {
    var data = {
      "actions": [
        {
          "id": 19,
          "status": "in-progress",
          "type": "create",
          "started_at": "2014-07-29T14:35:39Z",
          "completed_at": null,
          "resource_id": 123,
          "resource_type": "image",
          "region_slug": "nyc1",
          "region": {
            "name": "New York",
            "slug": "nyc1",
            "available": true,
            "sizes": ["512mb"],
            "features": ["virtio", "private_networking", "backups", "ipv6", "metadata"]
          }
        }
      ],
      "meta": {
        "total": 1
      }
    };

    it('lists volume actions', function() {
      testUtils.api.get('/v2/volumes/123/actions').reply(200, JSON.stringify(data));

      client.volumes.listActions(123, function(err, actions, headers) {
        expect(actions).to.shallowDeepEqual(data.actions);
      });
    });

    it('lists volume actions at page', function() {
      testUtils.api.get('/v2/volumes/123/actions?page=2').reply(200, JSON.stringify(data));

      client.volumes.listActions(123, 2, function(err, actions, headers) {
        expect(actions).to.shallowDeepEqual(data.actions);
      });
    });

    it('lists volume actions at page with length', function() {
      testUtils.api.get('/v2/volumes/123/actions?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.listActions(123, 2, 1, function(err, actions, headers) {
        expect(actions).to.shallowDeepEqual(data.actions);
      });
    });

    it('lists volume actions with a query object', function() {
      testUtils.api.get('/v2/volumes/123/actions?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.volumes.listActions(123, { page: 2, per_page: 1 }, function(err, actions, headers) {
        expect(actions).to.shallowDeepEqual(data.actions);
      });
    });

    it('escapes the name', function() {
      testUtils.api.get('/v2/volumes/foo%2Fbar/actions').reply(200, JSON.stringify(data));

      client.volumes.listActions('foo/bar', function(err, actions, headers) {
        expect(actions).to.shallowDeepEqual(data.actions);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/volumes/123/actions').reply(200, JSON.stringify(data));

      client.volumes.listActions(123).then(function(actions) {
        expect(actions).to.shallowDeepEqual(data.actions);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('get action', function() {
    var data = {
      "action": {
        "id": 456,
        "status": "in-progress",
        "type": "transfer",
        "started_at": "2014-07-29T14:35:27Z",
        "completed_at": null,
        "resource_id": 123,
        "resource_type": "image",
        "region_slug": "nyc1",
        "region": {
          "name": "New York",
          "slug": "nyc1",
          "available": true,
          "sizes": ["512mb"],
          "features": ["virtio", "private_networking", "backups", "ipv6", "metadata"]
        }
      }
    };

    it('returns the action', function() {
      testUtils.api.get('/v2/volumes/123/actions/456').reply(200, JSON.stringify(data));

      client.volumes.getAction(123, 456, function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('escapes the name', function() {
      testUtils.api.get('/v2/volumes/foo%2Fbar/actions/bar%2Fbaz').reply(200, JSON.stringify(data));

      client.volumes.getAction('foo/bar', 'bar/baz', function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/volumes/123/actions/456').reply(200, JSON.stringify(data));

      client.volumes.getAction(123, 456).then(function(action) {
        expect(action).to.shallowDeepEqual(data.action);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('attach', function() {
    var data = {
      "action": {
        "id": 36804751,
        "status": "in-progress",
        "type": "attach_volume",
        "started_at": "2014-11-14T16:31:07Z",
        "completed_at": null,
        "resource_id": null,
        "resource_type": "volume",
        "region": "nyc3",
        "region_slug": "nyc3"
      }
    };

    it('creates the action with a parameters hash', function() {
      var parameters = {
        droplet_id: 123
      };

      testUtils.api.post('/v2/volumes/123/actions',
        { type: 'attach', droplet_id: 123 }
      ).reply(202, data);

      client.volumes.attach(123, parameters, function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('creates the action with a droplet id', function() {
      testUtils.api.post('/v2/volumes/123/actions',
        { type: 'attach', droplet_id: 456 }
      ).reply(202, data);

      client.volumes.attach(123, 456, function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('escapes the name', function() {
      testUtils.api.post('/v2/volumes/foo%2Fbar/actions',
        { type: 'attach', droplet_id: 456 }
      ).reply(202, data);

      client.volumes.attach('foo/bar', 456, function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/volumes/123/actions',
        { type: 'attach', droplet_id: 456 }
      ).reply(202, data);

      client.volumes.attach(123, 456).then(function(action) {
        expect(action).to.shallowDeepEqual(data.action);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('detach', function() {
    var data = {
      "action": {
        "id": 36804751,
        "status": "in-progress",
        "type": "detach_volume",
        "started_at": "2014-11-14T16:31:07Z",
        "completed_at": null,
        "resource_id": null,
        "resource_type": "volume",
        "region": "nyc3",
        "region_slug": "nyc3"
      }
    };

    it('creates the action', function() {
      testUtils.api.post('/v2/volumes/123/actions', { type: 'detach' }).reply(202, data);

      client.volumes.detach(123, function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('escapes the name', function() {
      testUtils.api.post('/v2/volumes/foo%2Fbar/actions', { type: 'detach' }).reply(202, data);

      client.volumes.detach('foo/bar', function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/volumes/123/actions', { type: 'detach' }).reply(202, data);

      client.volumes.detach(123).then(function(action) {
        expect(action).to.shallowDeepEqual(data.action);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('resize', function() {
    var data = {
      "action": {
        "id": 36804751,
        "status": "in-progress",
        "type": "resize_volume",
        "started_at": "2014-11-14T16:31:07Z",
        "completed_at": null,
        "resource_id": null,
        "resource_type": "volume",
        "region": "nyc3",
        "region_slug": "nyc3"
      }
    };

    it('creates the action with a parameters hash', function() {
      var parameters = {
        region: 'nyc3',
        size_gigabytes: 100
      };

      testUtils.api.post('/v2/volumes/123/actions',
        { type: 'resize', region: 'nyc3', size_gigabytes: 100 }
      ).reply(202, data);

      client.volumes.resize(123, parameters, function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('creates the action with explicit arguments', function() {
      testUtils.api.post('/v2/volumes/123/actions',
        { type: 'resize', region: 'nyc3', size_gigabytes: 100 }
      ).reply(202, data);

      client.volumes.resize(123, 100, 'nyc3', function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('escapes the name', function() {
      testUtils.api.post('/v2/volumes/foo%2Fbar/actions',
        { type: 'resize', region: 'nyc3', size_gigabytes: 100 }
      ).reply(202, data);

      client.volumes.resize('foo/bar', 100, 'nyc3', function(err, action, headers) {
        expect(action).to.shallowDeepEqual(data.action);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/volumes/123/actions',
        { type: 'resize', region: 'nyc3', size_gigabytes: 100 }
      ).reply(202, data);

      client.volumes.resize(123, 100, 'nyc3').then(function(action) {
        expect(action).to.shallowDeepEqual(data.action);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });
});
