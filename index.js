'use strict';

import semver from 'semver';

export default class Heed {
  /**
   * Construct heed to.
   *
   * @Constructor
   * @param {Object} dependencies Map of dependencies to check against.
   * @api public
   */
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
  }

  /**
   * Convert an store the semver to ranges.
   *
   * @param {String} name Dependency.
   * @param {String} allowed Semver.
   * @returns {Boolean} both are valid.
   * @api private
   */
  set(name, allowed) {
    if (!allowed && name && ~name.indexOf('@')) [ name, allowed ] = name.split('@');
    if (!this.valid(name, allowed)) return [ false ];

    this.allowedRange = semver.validRange(allowed);
    this.dependencyRange = semver.validRange(this.dependencies[name]);

    return [ name, allowed ];
  }

  /**
   * Extract both semvers from the range.
   *
   * @param {String} range Advanced range descriptor for semver.
   * @returns {Array} lower and upper bound of the semver.
   * @api private.
   */
  extract(range) {
    range = range.replace(/[><=\|\|]*/g, '').replace(/\s+/, ' ').split(' ');
    return [range[0], range[1]];
  }

  /**
   * Are the dependency name and allowed semver valid?
   *
   * @param {String} name Dependency.
   * @param {String} allowed Semver.
   * @returns {Boolean} both are valid.
   * @api private
   */
  valid(name, allowed) {
    return semver.validRange(allowed) && 'string' === typeof name;
  }

  /**
   * Heed to the supplied package name and semver.
   *
   * @param {String|Array} pkg Name and semver, e.g. test@~1.2.3.
   * @returns {Boolean} dependency semver allowed or not.
   * @api public
   */
  to(...pkg) {
    let [ name, allowed ] = this.set(...pkg);
    let version = this.dependencies[name];
    let allowedRange = this.allowedRange;
    let dl, du;

    //
    // Package to check against is not part of the dependencies.
    //
    if (!name || !allowed || !version) return false;

    //
    // Execute the checks:
    //   1. Allowed range is a single version, to a direct check.
    //   2. Ranges are equal, the dependency is allowed.
    //   3. Dependency is no range and should satisfy the allowed semver range.
    //   4. Lower and upper bound of dependecy range satisfy the allowed range.
    //
    if (allowed === version) return true;
    if (allowedRange === this.dependencyRange) return true;
    if (version === this.dependencyRange) return semver.satisfies(version, allowedRange);

    [ dl, du ] = this.extract(this.dependencyRange);
    return semver.satisfies(dl, allowedRange) && semver.lte(du, this.extract(allowedRange)[1]);
  }
}