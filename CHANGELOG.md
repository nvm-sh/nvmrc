# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.2.1](https://github.com/nvm-sh/nvmrc/compare/v1.2.0...v1.2.1) - 2026-09-08

### Commits

- [Fix] treat a line beginning with `=` as a bare version, like `nvm` does [`be0fc38`](https://github.com/nvm-sh/nvmrc/commit/be0fc3873975150a33c9711757b8839fd9acdfaf)
- [Tests] increase coverage [`794c91c`](https://github.com/nvm-sh/nvmrc/commit/794c91c0c1a1b53cdc2c167efd489841fbd98920)
- [Fix] do not treat a BOM as whitespace, as `nvm` does not [`53c6fb1`](https://github.com/nvm-sh/nvmrc/commit/53c6fb1d150dcf5d865c04d5c6f4de94e3024844)
- [actions] update workflows [`b619f13`](https://github.com/nvm-sh/nvmrc/commit/b619f1363d2b407f162c9819b6848af6c7153e65)
- [Fix] split key/value pairs on the first `=` only [`5c59dc4`](https://github.com/nvm-sh/nvmrc/commit/5c59dc4b017ccb89b4f333f0889ea55cc2f55554)
- [Fix] strip comments in `.nvmrc` files with CRLF line endings [`06d9f93`](https://github.com/nvm-sh/nvmrc/commit/06d9f93a3d93c15a4de966a184dc82485857d8a7)
- [Dev Deps] update `@arethetypeswrong/cli`, `@ljharb/eslint-config`, `auto-changelog`, `eslint`, `tape` [`c4140f4`](https://github.com/nvm-sh/nvmrc/commit/c4140f477c6e5721e87a124c87bf55e87f302513)
- [Dev Deps] update `c8`, `eslint` [`77d1715`](https://github.com/nvm-sh/nvmrc/commit/77d17156912943313bd2d55cde80004f13d95bd3)
- [Dev Deps] update `auto-changelog` [`a8bc55a`](https://github.com/nvm-sh/nvmrc/commit/a8bc55a5ee15ab9008f695cc5e6c9afbb60cdd3c)
- [Dev Deps] update `@ljharb/eslint-config` [`fca4313`](https://github.com/nvm-sh/nvmrc/commit/fca4313639dc6fe45e86799527835f9972a6af9c)

## [v1.2.0](https://github.com/nvm-sh/nvmrc/compare/v1.1.1...v1.2.0) - 2026-01-22

### Fixed

- [New] add API entrypoint, with types [`#4`](https://github.com/nvm-sh/nvmrc/issues/4)

### Commits

- [Dev Deps] update `eslint` [`8c09e12`](https://github.com/nvm-sh/nvmrc/commit/8c09e12bd91acd3ceaadaa263158043e692bfec0)
- [Refactor] use stripVTControlCharacters instead of `strip-color` [`8b536b4`](https://github.com/nvm-sh/nvmrc/commit/8b536b42edc216ed31161476fbb4b94ab8eed5b1)
- [Dev Deps] update `@ljharb/eslint-config`, `npmignore` [`e8fda24`](https://github.com/nvm-sh/nvmrc/commit/e8fda2452581a34c2a48930776c67c8f4770dc53)

## [v1.1.1](https://github.com/nvm-sh/nvmrc/compare/v1.1.0...v1.1.1) - 2025-11-24

### Fixed

- [Fix] reject invalid semver ranges [`#2`](https://github.com/nvm-sh/nvmrc/issues/2)

### Commits

- [Dev Deps] update `@ljharb/eslint-config`, `auto-changelog`, `c8`, `tape` [`62f24bc`](https://github.com/nvm-sh/nvmrc/commit/62f24bc7dc58804044c5fbb4eeb867936c34c6fb)
- [Dev Deps] update `@ljharb/eslint-config`, `eslint`, `npmignore` [`32ee92c`](https://github.com/nvm-sh/nvmrc/commit/32ee92cbd833df225229f77dd57a577c1577fb0b)
- [Tests] replace `aud` with `npm audit` [`bea2633`](https://github.com/nvm-sh/nvmrc/commit/bea2633dd1cd50bcb0dffbcd7575af79a2058725)
- [meta] add missing peer dep [`673d7d9`](https://github.com/nvm-sh/nvmrc/commit/673d7d92a76d69a54b766b2e0c21474f7d3af908)

## [v1.1.0](https://github.com/nvm-sh/nvmrc/compare/v1.0.0...v1.1.0) - 2024-06-20

### Commits

- [New] add `--help`, `--version`; accept a path to another directory; nicer error messages [`69371ff`](https://github.com/nvm-sh/nvmrc/commit/69371ff3ed16cbd5f3328a9923a245f98dfb1612)
- [Tests] add more assertions [`41a8ad6`](https://github.com/nvm-sh/nvmrc/commit/41a8ad6df407230e6895342b79618a0297d98008)
- [Tests] reorganize tests [`9e280e5`](https://github.com/nvm-sh/nvmrc/commit/9e280e5d0e5e982c97eaef8e8358c5c855bccc7e)
- [Tests] `import.meta.dirname` is not always available [`43dbe63`](https://github.com/nvm-sh/nvmrc/commit/43dbe630edef4d76338a7b4b9bc4e485a9c9d0a1)
- [Tests] add more coverage [`0d325aa`](https://github.com/nvm-sh/nvmrc/commit/0d325aa903893072cb07daf43ae04b491e104d6c)
- [Dev Deps] update `c8`, `tape` [`5c481c1`](https://github.com/nvm-sh/nvmrc/commit/5c481c15a357392734daa70243947d98a8100da5)
- [patch] remove extra newline [`3a92b47`](https://github.com/nvm-sh/nvmrc/commit/3a92b479dd665f3bd1f575beb5cab2d10a0d34b4)
- [Deps] update `c8` [`1c01438`](https://github.com/nvm-sh/nvmrc/commit/1c01438772943fef0bc7979298194644b291ddca)
- [Dev Deps] pin eslint [`54f028c`](https://github.com/nvm-sh/nvmrc/commit/54f028c887748a08f46b7da60f4cb1b94908c277)

## v1.0.0 - 2024-06-05

### Commits

- Initial implementation, tests, readme [`521c4ac`](https://github.com/nvm-sh/nvmrc/commit/521c4ac9da7824c6547765ab37fa47da63ea9abe)
- Initial commit [`cc010de`](https://github.com/nvm-sh/nvmrc/commit/cc010defc5387908e5240dbd4bf87a7fc9465d8e)
- npm init [`9e16b7a`](https://github.com/nvm-sh/nvmrc/commit/9e16b7a662a628b86639479d6338708256d12cb9)
- Only apps should have lockfiles [`48899d8`](https://github.com/nvm-sh/nvmrc/commit/48899d831d41b7ecef029a1cef48e32c7ec11010)
