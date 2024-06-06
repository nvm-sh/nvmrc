# nvmrc <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

command-line tool to validate a `.nvmrc` file

## Example

Run:
```sh
$ nvmrc
```

When valid, the parsed JSON will be logged.

When invalid:
```sh
invalid .nvmrc!
all non-commented content (anything after # is a comment) must be either:
  - a single bare nvm-recognized version-ish
  - or, multiple distinct key-value pairs, each key/value separated by a single equals sign (=)

non-commented content parsed:
…
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

## Security

Please email [@ljharb](https://github.com/ljharb) or see https://tidelift.com/security if you have a potential security vulnerability to report.

[package-url]: https://npmjs.org/package/nvmrc
[npm-version-svg]: https://versionbadg.es/nvm-sh/nvmrc.svg
[deps-svg]: https://david-dm.org/nvm-sh/nvmrc.svg
[deps-url]: https://david-dm.org/nvm-sh/nvmrc
[dev-deps-svg]: https://david-dm.org/nvm-sh/nvmrc/dev-status.svg
[dev-deps-url]: https://david-dm.org/nvm-sh/nvmrc#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/nvmrc.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/nvmrc.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/nvmrc.svg
[downloads-url]: https://npm-stat.com/charts.html?package=nvmrc
[codecov-image]: https://codecov.io/gh/nvm-sh/nvmrc/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/nvm-sh/nvmrc/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/nvm-sh/nvmrc
[actions-url]: https://github.com/nvm-sh/nvmrc/actions
