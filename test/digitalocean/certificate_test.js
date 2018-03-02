'use strict';

var expect = require('chai').expect;

var testUtils = require('../testUtils');

var digitalocean = require('../../lib/digitalocean');
var token = testUtils.getUserDigitalOceanToken();
var client = digitalocean.client(token);

describe('certificate endpoints', function() {
  describe('list', function() {
    var response = {
      certificates: [
        {
          'id': '892071a0-bb95-49bc-8021-3afd67a210bf',
          'name': 'web-cert-01',
          'not_after': '2017-02-22T00:23:00Z',
          'sha1_fingerprint': 'dfcc9f57d86bf58e321c2c6c31c7a971be244ac7',
          'created_at': '2017-02-08T16:02:37Z'
        }
      ]
    };

    it('returns certificates', function() {
      testUtils.api.get('/v2/certificates').reply(200, response);

      client.certificates.list(function(err, certificates, headers) {
        expect(certificates).to.shallowDeepEqual(response.certificates);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/certificates').reply(200, response);

      client.certificates.list().then(function(certificates) {
        expect(certificates).to.shallowDeepEqual(response.certificates);
        done();
      }).catch(function(error) {
        done(error);
      });
    });

    it('returns a promisable with a query object', function(done) {
      testUtils.api.get('/v2/certificates?page=2&per_page=1').reply(
        200, response);

      client.certificates.list({ page: 2, per_page: 1 })
        .then(function(certificates) {
          expect(certificates).to.shallowDeepEqual(response.certificates);
          done();
        }).catch(function(error) {
          done(error);
        });
    });
  });

  describe('create', function() {
    var request = {
      name: "web-cert-01",
      private_key: "PRIVATE_KEY",
      leaf_certificate: "CERTIFICATE",
      certificate_chain: "CERTIFICATE_CHAIN"
    };

    var response = {
      certificate: {
        id: "892071a0-bb95-49bc-8021-3afd67a210bf",
        name: "web-cert-01",
        not_after: "2017-02-22T00:23:00Z",
        sha1_fingerprint: "dfcc9f57d86bf58e321c2c6c31c7a971be244ac7",
        created_at: "2017-02-08T16:02:37Z"
      }
    };

    it('creates a certificate entry', function() {
      testUtils.api.post('/v2/certificates', request).reply(201, response);

      client.certificates.create(request, function(error, certificate) {
        expect(certificate).to.shallowDeepEqual(response.certificate);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.post('/v2/certificates', request).reply(201, response);

      client.certificates.create(request).then(function(certificate) {
        expect(certificate).to.shallowDeepEqual(response.certificate)
        done();
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('get', function() {
    var response = {
      certificate: {
        "id": "foobar",
        "name": "web-cert-01",
        "not_after": "2017-02-22T00:23:00Z",
        "sha1_fingerprint": "dfcc9f57d86bf58e321c2c6c31c7a971be244ac7",
        "created_at": "2017-02-08T16:02:37Z"
      }
    };

    it('returns the certificate', function() {
      testUtils.api.get('/v2/certificates/foobar').reply(200, response);

      client.certificates.get('foobar', function(error, certificate) {
        expect(certificate).to.shallowDeepEqual(response.certificate);
      });
    });

    it('escapes the id', function() {
      testUtils.api.get('/v2/certificates/bob%2Fbuilder').reply(
        200, response);

      client.certificates.get('bob/builder', function(error, certificate) {
        expect(certificate).to.shallowDeepEqual(response.certificate);
      });
    });

    it('returns a promisable', function(done) {
      testUtils.api.get('/v2/certificates/cert').reply(200, response);

      client.certificates.get('cert').then(function(certificate) {
        expect(certificate).to.shallowDeepEqual(response.certificate);
        done();
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('delete', function() {
    it('deletes the certificate', function() {
      testUtils.api.delete('/v2/certificates/cert2').reply(204);

      client.certificates.delete('cert2', function(error) {
        expect(error).to.be.null;
      })
    })
  });
});
