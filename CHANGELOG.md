# [1.4.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.3.0...v1.4.0) (2020-09-17)


### Features

* **i18n:** we are now supporting multi-language projects as well ([a4fe89f](https://github.com/e-Spirit/fsxa-nuxt-module/commit/a4fe89ff7e4e1679fd50317bac9aa5f4fb165f3e))

# [1.3.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.7...v1.3.0) (2020-09-09)


### Features

* **fsxa-api:** update to fsxa-api v1.1.0 to support new tenantId feature ([2a081df](https://github.com/e-Spirit/fsxa-nuxt-module/commit/2a081df89dd99fe9d3f2b0e40f53c340b318e6e6))

## [1.2.7](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.6...v1.2.7) (2020-09-08)


### Bug Fixes

* **plugin:** introduce new fsxa-pattern-library and update nuxt-plugin to meet SSR requirements ([5f2f4a0](https://github.com/e-Spirit/fsxa-nuxt-module/commit/5f2f4a0e7073a5e35e9584db2ebac705623e1f01))

## [1.2.6](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.5...v1.2.6) (2020-09-08)


### Bug Fixes

* **plugin:** set appUrl for client mode ([ca32188](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ca3218881c387d2d0badafc8413e91e39a29cc8a))

## [1.2.5](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.4...v1.2.5) (2020-09-08)


### Bug Fixes

* **plugin:** fix wrong usage of NUXT_HOST env variable ([344369e](https://github.com/e-Spirit/fsxa-nuxt-module/commit/344369edb4a608cc52e5d4fc6d7bfb1af4c56d8a))

## [1.2.4](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.3...v1.2.4) (2020-09-08)


### Bug Fixes

* **plugin:** update client-check ([8d0692f](https://github.com/e-Spirit/fsxa-nuxt-module/commit/8d0692f870c8cee0dd3c584a7c048a13ca4a9471))

## [1.2.3](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.2...v1.2.3) (2020-09-08)


### Bug Fixes

* **plugin:** check if window exists to ensure that the correct baseUrl is passed to the API ([ea140cc](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ea140cc35701394ee2ec77c37f89894ab30b8287))

## [1.2.2](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.1...v1.2.2) (2020-09-08)


### Bug Fixes

* **plugin:** switch to usage of NUXT_HOST and NUXT_PORT environment variables during build ([496047f](https://github.com/e-Spirit/fsxa-nuxt-module/commit/496047f601f2911cf4a9cfac1ea568841521d944))

## [1.2.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.0...v1.2.1) (2020-09-08)


### Bug Fixes

* **plugin:** remove appUrl usage from plugin and add internal routing to localhost:3000 when in SSR ([0d6e7c8](https://github.com/e-Spirit/fsxa-nuxt-module/commit/0d6e7c8d605fd7c9be7c924565ed9b76b13302ce))

# [1.2.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.1.0...v1.2.0) (2020-09-07)


### Features

* **configuration:** we introduced a new required configuration option named *appUrl* ([3a272ec](https://github.com/e-Spirit/fsxa-nuxt-module/commit/3a272ecd1365d3c2095fc583a5c27cce93f326c6))

# [1.1.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.4...v1.1.0) (2020-09-04)


### Bug Fixes

* **mapping:** subfolders are now correctly mapped to component-keys ([c77b0da](https://github.com/e-Spirit/fsxa-nuxt-module/commit/c77b0da26e5ef2a61b3ae8be868036a97abf4887))


### Features

* **api:** you can now add custom routes to the backend api ([ae8a8a2](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ae8a8a2ce5741dbd5a8e3ba942cfc565a58e5014))

## [1.0.4](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.3...v1.0.4) (2020-08-31)


### Bug Fixes

* **windows compat:** we are now using path.join for path construction ([b034446](https://github.com/e-Spirit/fsxa-nuxt-module/commit/b034446d7f055ac52d2485707daddbfa18811396))

## [1.0.3](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.2...v1.0.3) (2020-08-25)


### Bug Fixes

* **express-api:** fix wrong export in ServerMiddleware ([4708516](https://github.com/e-Spirit/fsxa-nuxt-module/commit/47085164d1eb62b224476e79e1916905af84d8bd))

## [1.0.2](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.1...v1.0.2) (2020-08-25)


### Bug Fixes

* **express-api:** remove import statements from server-middleware ([73a15a1](https://github.com/e-Spirit/fsxa-nuxt-module/commit/73a15a148709dcdb06a5079b8918808ce6215bee))

## [1.0.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.0...v1.0.1) (2020-08-25)


### Bug Fixes

* **package.json:** fix missing dependencies bug ([f856abd](https://github.com/e-Spirit/fsxa-nuxt-module/commit/f856abdb19eca3bb58a836a0907151e2c86e5d89))

# 1.0.0 (2020-08-25)


### Features

* **initial release:** release initial FSXA Nuxt-Module ([8dffd6a](https://github.com/e-Spirit/fsxa-nuxt-module/commit/8dffd6a2b6198b8fb814d256825fa5024944417e))
