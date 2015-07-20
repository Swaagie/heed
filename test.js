'use strict';

import assume from 'assume';
import Heed from './index';

describe('Heed', function () {
  let heed;
  let deps;

  beforeEach(function () {
    deps = {
      'test': '1.2.3',
      'tilde': '~2.1.0',
      'caret': '^0.7.3',
      'major': '~1.9.2',
      'release': '1.0.0-alpha2'
    };

    heed = new Heed(deps);
  });

  afterEach(function () {
    deps = heed = null;
  });

  it('exposes a constructor', function () {
    assume(Heed).to.be.a('function');
    assume(Heed.constructor).to.be.a('function');
    assume(new Heed(deps, 'test')).to.be.instanceof(Heed);
    assume(heed.dependencies).to.be.an('object');
    assume(heed.dependencies).to.equal(deps);
  });

  it('ignores invalid properties', function () {
    heed = new Heed(deps, {}, '1.2.invalid');

    assume(heed).to.not.have.property('name', 'test');
    assume(heed).to.not.have.property('allowed', '1.2.invalid');
  });

  describe('#deps', function () {
    it('is a function', function () {
      assume(heed.deps).to.be.a('function');
    });

    it('sets the dependencies', function () {
      let obj = {};
      let result = heed.deps(obj);

      assume(heed.dependencies).to.equal(obj);
      assume(result).to.be.instanceof(Heed);
    });
  });

  describe('#to', function () {
    it('is a function', function () {
      assume(heed.to).to.be.a('function');
    });

    it('allows multiple arguments to identify the package', function () {
      assume(heed.to('test@1.2.3')).to.equal(true);
      assume(heed.to('test', '1.2.3')).to.equal(true);
    });

    it('returns false of no version is supplied', function () {
      assume(heed.to()).to.equal(false);
    });

    it('returns true if the ranges are equal', function () {
      assume(heed.to('tilde', '~2.1.0')).to.equal(true);
      assume(heed.to('tilde', '2.1.x')).to.equal(true);
    });

    it('returns true if the dependency bounds satisfy the allowed range', function () {
      assume(heed.to('tilde', '~2.1.0')).to.equal(true);
      assume(heed.to('tilde', '~2.1')).to.equal(true);
      assume(heed.to('caret', '^0.7.2')).to.equal(true);
      assume(heed.to('major', '~1')).to.equal(true);
      assume(heed.to('major', '^1.4')).to.equal(true);
      assume(heed.to('release', '^1.0.0-alpha1')).to.equal(true);
    });

    it('returns false if the dependency bounds fall outside the allowed range', function () {
      assume(heed.to('tilde', '~1.8.4')).to.equal(false);
      assume(heed.to('tilde', '~0.7.4')).to.equal(false);
      assume(heed.to('caret', '^0.8.0')).to.equal(false);
      assume(heed.to('major', '~1.4')).to.equal(false);
      assume(heed.to('major', '^1.10')).to.equal(false);
      assume(heed.to('release', '0.9.x')).to.equal(false);
    });
  });
});