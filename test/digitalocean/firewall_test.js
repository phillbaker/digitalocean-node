'use strict';

var expect = require('chai').expect;

var testUtils = require('../testUtils');

var digitalocean = require('../../lib/digitalocean');
var token = testUtils.getUserDigitalOceanToken();
var client = digitalocean.client(token);

describe('firewall endpoints', function() {
  describe('list', function() {
    var data = {
      "firewalls": [
      ],
      "meta": {
        "total": 0
      }
    };

    it('returns firewalls', function() {
      testUtils.api.get('/v2/firewalls').reply(200, JSON.stringify(data));

      client.firewalls.list(function(err, firewalls, headers) {
        expect(firewalls).to.shallowDeepEqual(data.firewalls);
      });
    });

    it('returns firewalls at page', function() {
      testUtils.api.get('/v2/firewalls?page=2').reply(200, JSON.stringify(data));

      client.firewalls.list(2, function(err, firewalls, headers) {
        expect(firewalls).to.shallowDeepEqual(data.firewalls);
      });
    });

    it('returns firewalls at page with length', function() {
      testUtils.api.get('/v2/firewalls?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.firewalls.list(2, 1, function(err, firewalls, headers) {
        expect(firewalls).to.shallowDeepEqual(data.firewalls);
      });
    });

    it('returns firewalls with a query object', function() {
      testUtils.api.get('/v2/firewalls?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.firewalls.list({ page: 2, per_page: 1 }, function(err, firewalls, headers) {
        expect(firewalls).to.shallowDeepEqual(data.firewalls);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/firewalls').reply(200, JSON.stringify(data));

      client.firewalls.list().then(function(firewalls) {
        expect(firewalls).to.shallowDeepEqual(data.firewalls);
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('returns a promisable with a query object', function(done) {
      testUtils.api.get('/v2/firewalls?page=2&per_page=1').reply(200, JSON.stringify(data));

      client.firewalls.list({ page: 2, per_page: 1 }).then(function(firewalls) {
        expect(firewalls).to.shallowDeepEqual(data.firewalls);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('create', function() {
    var data = {
      "firewall": {
        "name": "foo",
      }
    };

    var attributes = {
      "name": "foo",
      "inbound_rules": [
        {
          "protocol": "tcp",
          "ports": "80",
          "sources": {
            "addresses": [
              "18.0.0.0/8"
            ]
          }
        },
        {
          "protocol": "tcp",
          "ports": 22,
          "sources": {
            "tags": [
              "foo"
            ],
            "addresses": [
              "18.0.0.0/8"
            ]
          }
        }
      ],
      "outbound_rules": [
        {
          "protocol": "tcp",
          "ports": "80",
          "destinations": {
            "addresses": [
              "0.0.0.0/0",
              "::/0"
            ]
          }
        }
      ],
      "tags": null
    };

    it('creates the firewall', function() {
      testUtils.api.post('/v2/firewalls', attributes).reply(201, data);

      client.firewalls.create(attributes, function(err, firewall, headers) {
        expect(firewall).to.shallowDeepEqual(data.firewall);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/firewalls', attributes).reply(201, data);

      client.firewalls.create(attributes).then(function(firewall) {
        expect(firewall).to.shallowDeepEqual(data.firewall);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('get', function() {
    var data = {
      "firewall": {
        "name": "foo",
      }
    };

    it('returns the firewall', function() {
      testUtils.api.get('/v2/firewalls/foo').reply(200, JSON.stringify(data));

      client.firewalls.get('foo', function(err, firewall, headers) {
        expect(firewall).to.shallowDeepEqual(data.firewall);
      });
    });

    it('escapes the name', function() {
      testUtils.api.get('/v2/firewalls/foo%2Fbar').reply(200, JSON.stringify(data));

      client.firewalls.get('foo/bar', function(err, firewall, headers) {
        expect(firewall).to.shallowDeepEqual(data.firewall);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/firewalls/foo').reply(200, JSON.stringify(data));

      client.firewalls.get('foo').then(function(firewall) {
        expect(firewall).to.shallowDeepEqual(data.firewall);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('addDroplets', function() {
    var droplet_ids = [
      "9569411",
      "3465345",
    ];

    it('adds droplets to firewall', function() {
      testUtils.api.post('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/droplets', { droplet_ids: droplet_ids }).reply(204, '');

      client.firewalls.addDroplets('bb4b2611-3d72-467b-8602-280330ecd65c', droplet_ids, function(err, firewall, headers) {
        expect(err).to.be.null;
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/droplets', { droplet_ids: droplet_ids }).reply(204, '');

      client.firewalls.addDroplets('bb4b2611-3d72-467b-8602-280330ecd65c', droplet_ids).then(function(result) {
        expect(result).to.be.present;
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('removeDroplets', function() {
    var droplet_ids = [
      "9569411",
      "3465345",
    ];

    it('remove droplets from firewall', function() {
      testUtils.api.delete('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/droplets', { droplet_ids: droplet_ids }).reply(204, '');

      client.firewalls.removeDroplets('bb4b2611-3d72-467b-8602-280330ecd65c', droplet_ids, function(err, firewall, headers) {
        expect(err).to.be.null;
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.delete('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/droplets', { droplet_ids: droplet_ids }).reply(204, '');

      client.firewalls.removeDroplets('bb4b2611-3d72-467b-8602-280330ecd65c', droplet_ids).then(function(result) {
        expect(result).to.be.present;
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('addTags', function() {
    var tags = [
      "foo",
      "foo bar",
    ];

    it('adds tags to firewall', function() {
      testUtils.api.post('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/tags', { tags: tags }).reply(204, '');

      client.firewalls.addTags('bb4b2611-3d72-467b-8602-280330ecd65c', tags, function(err, firewall, headers) {
        expect(err).to.be.null;
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/tags', { tags: tags }).reply(204, '');

      client.firewalls.addTags('bb4b2611-3d72-467b-8602-280330ecd65c', tags).then(function(result) {
        expect(result).to.be.present;
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('removeTags', function() {
    var tags = [
      "foo",
      "foo bar",
    ];

    it('remove tags from firewall', function() {
      testUtils.api.delete('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/tags', { tags: tags }).reply(204, '');

      client.firewalls.removeTags('bb4b2611-3d72-467b-8602-280330ecd65c', tags, function(err, firewall, headers) {
        expect(err).to.be.null;
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.delete('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/tags', { tags: tags }).reply(204, '');

      client.firewalls.removeTags('bb4b2611-3d72-467b-8602-280330ecd65c', tags).then(function(result) {
        expect(result).to.be.present;
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('addRules', function() {
    var rules = {
      "inbound_rules": [
        {
          "protocol": "tcp",
          "ports": "3306",
          "sources": {
            "droplet_ids": [
              49696269
            ]
          }
        }
      ],
      "outbound_rules": [
        {
          "protocol": "tcp",
          "ports": "3306",
          "destinations": {
            "droplet_ids": [
              49696269
            ]
          }
        }
      ]
    };

    it('adds rules to firewall', function() {
      testUtils.api.post('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/rules', rules).reply(204, '');

      client.firewalls.addRules('bb4b2611-3d72-467b-8602-280330ecd65c', rules, function(err, firewall, headers) {
        expect(err).to.be.null;
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/rules', rules).reply(204, '');

      client.firewalls.addRules('bb4b2611-3d72-467b-8602-280330ecd65c', rules).then(function(result) {
        expect(result).to.be.present;
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('removeRules', function() {
    var rules = {
      "inbound_rules": [
        {
          "protocol": "tcp",
          "ports": "3306",
          "sources": {
            "droplet_ids": [
              49696269
            ]
          }
        }
      ],
      "outbound_rules": [
        {
          "protocol": "tcp",
          "ports": "3306",
          "destinations": {
            "droplet_ids": [
              49696269
            ]
          }
        }
      ]
    };

    it('remove rules from firewall', function() {
      testUtils.api.delete('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/rules', rules).reply(204, '');

      client.firewalls.removeRules('bb4b2611-3d72-467b-8602-280330ecd65c', rules, function(err, firewall, headers) {
        expect(err).to.be.null;
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.delete('/v2/firewalls/bb4b2611-3d72-467b-8602-280330ecd65c/rules', rules).reply(204, '');

      client.firewalls.removeRules('bb4b2611-3d72-467b-8602-280330ecd65c', rules).then(function(result) {
        expect(result).to.be.present;
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

});
