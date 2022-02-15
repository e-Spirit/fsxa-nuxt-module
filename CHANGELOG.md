# [5.2.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v5.1.0...v5.2.0) (2022-02-15)


### Features

* **change stream:** accessing the FSXA API EventSource ([#29](https://github.com/e-Spirit/fsxa-nuxt-module/issues/29)) ([4c3b434](https://github.com/e-Spirit/fsxa-nuxt-module/commit/4c3b4340fc69e4c77515d6a3317858c06cba8953))

# [5.1.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v5.0.1...v5.1.0) (2022-02-11)


### Features

* **fsxa-api:** update fsxa-api and pattern-library for references to sections ([#31](https://github.com/e-Spirit/fsxa-nuxt-module/issues/31)) ([473c9c4](https://github.com/e-Spirit/fsxa-nuxt-module/commit/473c9c4a2b11eaee0a079625662c815d076909c9))

## [5.0.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v5.0.0...v5.0.1) (2022-02-09)


### Bug Fixes

* **fsxa-pattern-lib version:** update fsxa-pattern-library ([#30](https://github.com/e-Spirit/fsxa-nuxt-module/issues/30)) ([8e42a15](https://github.com/e-Spirit/fsxa-nuxt-module/commit/8e42a15ce244b33fa70ab2cef3b8461695f6f85d))

# [5.0.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v4.0.5...v5.0.0) (2022-02-08)


### Features

* **env:** update fsxa dependencies and remove FSXA_HOST and FSXA_PORT ([#27](https://github.com/e-Spirit/fsxa-nuxt-module/issues/27)) ([1af8e62](https://github.com/e-Spirit/fsxa-nuxt-module/commit/1af8e628f81b233e83bb31c0aa28e6232e646ea1))


### BREAKING CHANGES

* **env:** We updated the dependency to latest fsxa-api version, introducing new "type" attribute for public interfaces. This may cause your application to break. Details how to handle this can be found in the [Changelog of the fsxa-api](https://github.com/e-Spirit/fsxa-api/blob/master/CHANGELOG.md#breaking-changes).

## [4.0.5](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v4.0.4...v4.0.5) (2022-01-14)


### Bug Fixes

* **dependencies:** update fsxa-api and fsxa-pattern-library ([#28](https://github.com/e-Spirit/fsxa-nuxt-module/issues/28)) ([c290741](https://github.com/e-Spirit/fsxa-nuxt-module/commit/c290741c9b44adb56793e2f08a7064d35794d0c5))

## [4.0.4](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v4.0.3...v4.0.4) (2022-01-11)


### Bug Fixes

* **dependencies:** update fsxa-pattern-library to enable InEdit ([#26](https://github.com/e-Spirit/fsxa-nuxt-module/issues/26)) ([567fa26](https://github.com/e-Spirit/fsxa-nuxt-module/commit/567fa2644958724cf966a7267f6b73369ce1c0ad))

## [4.0.3](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v4.0.2...v4.0.3) (2022-01-11)


### Bug Fixes

* **dependencies:** update fsxa dependencies ([#25](https://github.com/e-Spirit/fsxa-nuxt-module/issues/25)) ([7bc4a98](https://github.com/e-Spirit/fsxa-nuxt-module/commit/7bc4a98f4f8fcef7517a6258964c7bce73563943))

## [4.0.2](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v4.0.1...v4.0.2) (2021-12-21)


### Bug Fixes

* **plugin:** add missing contentMode parameter to getFSXAModule ([#24](https://github.com/e-Spirit/fsxa-nuxt-module/issues/24)) ([364f895](https://github.com/e-Spirit/fsxa-nuxt-module/commit/364f89519c3e1ce0e20273614932045e1a22f293))

## [4.0.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v4.0.0...v4.0.1) (2021-12-20)


### Bug Fixes

* fix protocol for api calls from localhost ([#23](https://github.com/e-Spirit/fsxa-nuxt-module/issues/23)) ([c8762e0](https://github.com/e-Spirit/fsxa-nuxt-module/commit/c8762e0b23798380232f31089eacbb299aebaa4d))


# [4.0.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.8.0...v4.0.0) (2021-12-15)


### Features

* enable usage of navigationFilter and preFilterFetch ([#22](https://github.com/e-Spirit/fsxa-nuxt-module/issues/22)) ([40f3540](https://github.com/e-Spirit/fsxa-nuxt-module/commit/40f35407594bdf804d9cafb5ffc81077827246e6))


### BREAKING CHANGES

- The original fsxa-api class was removed and the new ones FSXAProxyApi and FSXARemoteApi are used. They have slightly different, but better, method signatures. For more information, please read the migration guide in the CHANGELOG of the FSXA-API.
- Environment variables FSXA_HOST and FSXA_PORT have to be configured in your production environments. Make sure to set the variables in your PWA deployments. In testing scenarios, http://localhost:3000 will be used. Please read the migration guide below.

### Migration Guide

Since there are new environment variables, the referencing PWA's nuxt.config.ts needs to be adjusted.
Place the following code snippet inside the NuxtConfig object:
```typescript
publicRuntimeConfig: {
    FSXA_HOST: process.env.FSXA_HOST,
    FSXA_PORT: process.env.FSXA_PORT,
    FSXA_MODE: process.env.FSXA_MODE
},
```

It will make the environment variables available inside your application.
The modules array also needs this information. So add it to the modules configuration as well.
Additionally the variables NUXT_HOST and NUXT_PORT defined in the PWA's configuration need to be handed over.
```typescript
modules: [
...
    [
    'fsxa-nuxt-module',
        {
            FSXA_HOST: process.env.FSXA_HOST,
            FSXA_PORT: process.env.FSXA_PORT,
            FSXA_MODE: process.env.FSXA_MODE,
            NUXT_HOST: process.env.NUXT_HOST,
            NUXT_PORT: process.env.NUXT_PORT
        }
    ]
],
```

# [3.7.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.6.0...v3.7.0) (2021-12-03)

### Features

- let apps including this module build without env variables ([#17](https://github.com/e-Spirit/fsxa-nuxt-module/issues/17)) ([12f1381](https://github.com/e-Spirit/fsxa-nuxt-module/commit/12f1381d66c82ac7e0d16068e4f663e9e8c48d71))

# [3.6.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.5.1...v3.6.0) (2021-11-18)

### Features

- **customization:** implement possibility to customize the middleware path ([b2014a2](https://github.com/e-Spirit/fsxa-nuxt-module/commit/b2014a20dc67c88f9b62e55a52ee80920c1ce1a3))

## [3.5.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.5.0...v3.5.1) (2021-08-16)

### Bug Fixes

- update dependencies ([#8](https://github.com/e-Spirit/fsxa-nuxt-module/issues/8)) ([ab4a52e](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ab4a52e9ab9439e9f68246af62069c97ae0b5d99))

# [3.5.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.4.2...v3.5.0) (2021-07-01)

### Features

- **index:** add new fsxa-api version ([29400ef](https://github.com/e-Spirit/fsxa-nuxt-module/commit/29400ef0436f226618fe08a4f3d76b413d3a6a0f))
- **index:** added new fsxa-api version ([26291e3](https://github.com/e-Spirit/fsxa-nuxt-module/commit/26291e32b7c9db89bf6049e5436986f5462f60c5))

## [3.4.2](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.4.1...v3.4.2) (2021-06-25)

### Bug Fixes

- remove unused dependencies ([2a9e221](https://github.com/e-Spirit/fsxa-nuxt-module/commit/2a9e2214ed86d516c8b5aba45cffe62cf390cc0c))

## [3.4.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.4.0...v3.4.1) (2021-06-25)

### Bug Fixes

- add documentation for adjusting TPP-SNAP version ([214f5af](https://github.com/e-Spirit/fsxa-nuxt-module/commit/214f5afcdb4fb967f2c988013214b80f26348a22))

# [3.4.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.3.0...v3.4.0) (2021-05-03)

### Features

- **devmodeinfo:** added a new template to be displayed when devMode is active ([e0fad1d](https://github.com/e-Spirit/fsxa-nuxt-module/commit/e0fad1dbc19081d05368b57240afe66116497c94))

# [3.3.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.2.0...v3.3.0) (2021-04-14)

### Features

- **fs-tpp-snap:** added a new entry to define the tpp-snap version ([e9dd970](https://github.com/e-Spirit/fsxa-nuxt-module/commit/e9dd97059dda4b882575b2eed11e8999c722d3f7))

# [3.2.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.1.0...v3.2.0) (2021-03-12)

### Features

- upgrade fsxa-api and fsxa-pattern-library to newest version ([49ab441](https://github.com/e-Spirit/fsxa-nuxt-module/commit/49ab441c57348c4d0922c8d728049b40bf2e9edd))

# [3.1.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v3.0.0...v3.1.0) (2020-12-14)

### Features

- **sitemap / fsxa-api:** we've updated the fsxa-api and added a sitemap route ([6abdda5](https://github.com/e-Spirit/fsxa-nuxt-module/commit/6abdda5dfca8c75410a50daba0bb16fe8af5e8ab))

# [3.0.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v2.2.1...v3.0.0) (2020-12-09)

### Features

- **configuration / dataset support:** changed configuration of components and its file structure ([ae69a42](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ae69a4248dc29b9a23a177102716058e2c9f5b01))

### BREAKING CHANGES

- **configuration / dataset support:** - Components will now be passed as a single configuration option

## [2.2.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v2.2.0...v2.2.1) (2020-11-02)

### Bug Fixes

- **dependencies:** add loose coupling for dependency versions ([d63e782](https://github.com/e-Spirit/fsxa-nuxt-module/commit/d63e78242e012a108c742606732c6ca9a47d05b4))

# [2.2.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v2.1.0...v2.2.0) (2020-10-28)

### Features

- **logging:** you can now specify a logLevel through your config file ([0cdcc39](https://github.com/e-Spirit/fsxa-nuxt-module/commit/0cdcc39b420936cfb91c270126a693449af64101))

# [2.1.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v2.0.0...v2.1.0) (2020-10-14)

### Features

- **datasets:** add datasets support and switch internally to getExpressRouter exposed by fsxaapi ([a5d1fb1](https://github.com/e-Spirit/fsxa-nuxt-module/commit/a5d1fb10c0b0597f8fc09019bb4128b94226deff))

# [2.0.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.4.2...v2.0.0) (2020-10-05)

### Bug Fixes

- **options:** fix custom route format ([d53db84](https://github.com/e-Spirit/fsxa-nuxt-module/commit/d53db84fb0323f238f2acea877bd26676b96b089))

### BREAKING CHANGES

- **options:** You can no longer pass middlewarOptions. Use the customRoutes option instead.

## [1.4.2](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.4.1...v1.4.2) (2020-09-24)

### Bug Fixes

- **automatic file mapping:** nuxt was not able to watch newly created directories for components ([87dcf9a](https://github.com/e-Spirit/fsxa-nuxt-module/commit/87dcf9a4760a8e1116670a59598af4489e6eb576))

## [1.4.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.4.0...v1.4.1) (2020-09-18)

### Bug Fixes

- **configuration:** remove obsolete appUrl setting ([1a2368a](https://github.com/e-Spirit/fsxa-nuxt-module/commit/1a2368a90915abcf684815dce2210486b4e88316))

# [1.4.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.3.0...v1.4.0) (2020-09-17)

### Features

- **i18n:** we are now supporting multi-language projects as well ([a4fe89f](https://github.com/e-Spirit/fsxa-nuxt-module/commit/a4fe89ff7e4e1679fd50317bac9aa5f4fb165f3e))

# [1.3.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.7...v1.3.0) (2020-09-09)

### Features

- **fsxa-api:** update to fsxa-api v1.1.0 to support new tenantId feature ([2a081df](https://github.com/e-Spirit/fsxa-nuxt-module/commit/2a081df89dd99fe9d3f2b0e40f53c340b318e6e6))

## [1.2.7](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.6...v1.2.7) (2020-09-08)

### Bug Fixes

- **plugin:** introduce new fsxa-pattern-library and update nuxt-plugin to meet SSR requirements ([5f2f4a0](https://github.com/e-Spirit/fsxa-nuxt-module/commit/5f2f4a0e7073a5e35e9584db2ebac705623e1f01))

## [1.2.6](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.5...v1.2.6) (2020-09-08)

### Bug Fixes

- **plugin:** set appUrl for client mode ([ca32188](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ca3218881c387d2d0badafc8413e91e39a29cc8a))

## [1.2.5](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.4...v1.2.5) (2020-09-08)

### Bug Fixes

- **plugin:** fix wrong usage of NUXT_HOST env variable ([344369e](https://github.com/e-Spirit/fsxa-nuxt-module/commit/344369edb4a608cc52e5d4fc6d7bfb1af4c56d8a))

## [1.2.4](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.3...v1.2.4) (2020-09-08)

### Bug Fixes

- **plugin:** update client-check ([8d0692f](https://github.com/e-Spirit/fsxa-nuxt-module/commit/8d0692f870c8cee0dd3c584a7c048a13ca4a9471))

## [1.2.3](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.2...v1.2.3) (2020-09-08)

### Bug Fixes

- **plugin:** check if window exists to ensure that the correct baseUrl is passed to the API ([ea140cc](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ea140cc35701394ee2ec77c37f89894ab30b8287))

## [1.2.2](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.1...v1.2.2) (2020-09-08)

### Bug Fixes

- **plugin:** switch to usage of NUXT_HOST and NUXT_PORT environment variables during build ([496047f](https://github.com/e-Spirit/fsxa-nuxt-module/commit/496047f601f2911cf4a9cfac1ea568841521d944))

## [1.2.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.2.0...v1.2.1) (2020-09-08)

### Bug Fixes

- **plugin:** remove appUrl usage from plugin and add internal routing to localhost:3000 when in SSR ([0d6e7c8](https://github.com/e-Spirit/fsxa-nuxt-module/commit/0d6e7c8d605fd7c9be7c924565ed9b76b13302ce))

# [1.2.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.1.0...v1.2.0) (2020-09-07)

### Features

- **configuration:** we introduced a new required configuration option named _appUrl_ ([3a272ec](https://github.com/e-Spirit/fsxa-nuxt-module/commit/3a272ecd1365d3c2095fc583a5c27cce93f326c6))

# [1.1.0](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.4...v1.1.0) (2020-09-04)

### Bug Fixes

- **mapping:** subfolders are now correctly mapped to component-keys ([c77b0da](https://github.com/e-Spirit/fsxa-nuxt-module/commit/c77b0da26e5ef2a61b3ae8be868036a97abf4887))

### Features

- **api:** you can now add custom routes to the backend api ([ae8a8a2](https://github.com/e-Spirit/fsxa-nuxt-module/commit/ae8a8a2ce5741dbd5a8e3ba942cfc565a58e5014))

## [1.0.4](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.3...v1.0.4) (2020-08-31)

### Bug Fixes

- **windows compat:** we are now using path.join for path construction ([b034446](https://github.com/e-Spirit/fsxa-nuxt-module/commit/b034446d7f055ac52d2485707daddbfa18811396))

## [1.0.3](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.2...v1.0.3) (2020-08-25)

### Bug Fixes

- **express-api:** fix wrong export in ServerMiddleware ([4708516](https://github.com/e-Spirit/fsxa-nuxt-module/commit/47085164d1eb62b224476e79e1916905af84d8bd))

## [1.0.2](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.1...v1.0.2) (2020-08-25)

### Bug Fixes

- **express-api:** remove import statements from server-middleware ([73a15a1](https://github.com/e-Spirit/fsxa-nuxt-module/commit/73a15a148709dcdb06a5079b8918808ce6215bee))

## [1.0.1](https://github.com/e-Spirit/fsxa-nuxt-module/compare/v1.0.0...v1.0.1) (2020-08-25)

### Bug Fixes

- **package.json:** fix missing dependencies bug ([f856abd](https://github.com/e-Spirit/fsxa-nuxt-module/commit/f856abdb19eca3bb58a836a0907151e2c86e5d89))

# 1.0.0 (2020-08-25)

### Features

- **initial release:** release initial FSXA Nuxt-Module ([8dffd6a](https://github.com/e-Spirit/fsxa-nuxt-module/commit/8dffd6a2b6198b8fb814d256825fa5024944417e))
