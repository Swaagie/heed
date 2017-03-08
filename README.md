# Heed

[![Greenkeeper badge](https://badges.greenkeeper.io/Swaagie/heed.svg)](https://greenkeeper.io/)

[![Version npm][version]](http://browsenpm.org/package/heed)[![Build Status][build]](https://travis-ci.org/Swaagie/heed)[![Dependencies][david]](https://david-dm.org/Swaagie/heed)[![Coverage Status][cover]](https://coveralls.io/r/Swaagie/heed?branch=master)

[version]: http://img.shields.io/npm/v/heed.svg?style=flat-square
[build]: http://img.shields.io/travis/Swaagie/heed/master.svg?style=flat-square
[david]: https://img.shields.io/david/Swaagie/heed.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/Swaagie/heed/master.svg?style=flat-square

Check dependency semver against an allowed semver. Comparing semver ranges
is difficult. This module checks if the depedency is allowed for the
supplied range.

### Install

```bash
npm install --save heed
```

### Usage

```js
import Heed from 'heed';

let heed = new Heed({
  dep1: '~0.5.6',
  dep2: '^0.9'
})

heed.to('dep1', '~0.5.0') === true;
heed.to('dep2', '1.0.0') === false;
```

### Test

```bash
git clone git@github.com:Swaagie/heed.git && cd heed
npm install && npm test
```

### License

MIT, see LICENSE.md