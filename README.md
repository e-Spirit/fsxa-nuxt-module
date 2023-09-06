# :exclamation: Important Notice: This Repository is Deprecated

## Important Notice

This repository has been deprecated and is no longer actively maintained. We recommend you use the [crownpeak-pwa-template](https://github.com/e-Spirit/crownpeak-pwa-template) instead.

# FSXA-Nuxt-Module

This module is integrating the [FSXA-Pattern-Library](https://github.com/e-Spirit/fsxa-pattern-library).

### About the FSXA

The FirstSpirit Experience Accelerator (FSXA) is the hybrid solution of a digital
experience platform, combining a headless approach with enterprise capabilities.
The FSXA stack consists of five repositories:

- [FSXA-PWA](https://github.com/e-Spirit/fsxa-pwa)
- [FSXA-UI](https://github.com/e-Spirit/fsxa-ui)/ Component Library
- [FSXA-Nuxt-Module](https://github.com/e-Spirit/fsxa-nuxt-module)
- [FSXA-Pattern-Library](https://github.com/e-Spirit/fsxa-pattern-library)
- [FSXA-API](https://github.com/e-Spirit/fsxa-api)

While the FSXA-API is a maintained product with a life cycle, the FSXA-PWA, FSXA-UI, FSXA-Nuxt-Module and FSXA-Pattern-Library are merely best practices examples how a project could be set up and integrate the FSXA-API.
The latter repositories can be forked to speed up the startup time of a frontend project or to understand how common use cases can be solved in headless projects.
The code itself can therefore also be used as documentation of best practices.

The following image illustrates the product cut:
![fsxa-stack product cut overview](docs/assets/fsxa-stack-product-status.png)

> **_Attention_**
> Since the reference implementation does not represent a maintained product, we do not guarantee support for its use.

### Experimental features

Features marked as _experimental_ are subject to change as long as they remain in the _experimental_ state.
Breaking changes to _experimental_ features are not reflected in a major version change.

## Getting Started

### Installation

```bash
# npm
npm install fsxa-nuxt-module

# yarn
yarn add fsxa-nuxt-module
```

### Run your tests

```
npm run test
```

> **NOTE:** Currently the tests in FSXA-Nuxt-Module are not compatible to windows environments. If you want to run the tests in windows environment, we recommend to use [WSL](https://docs.microsoft.com/windows/wsl/install).

### Initialize Store

In order for the FSXA module of the FSXA-Pattern-Library to be registered with the Vuex store, it is necessary that Nuxt initializes Vuex already.
So if you don't have a `store/index.(js/ts)` file yet, create it.

In addition, it is necessary that in the nuxtServerInit action of the Vuex store, the FSXA module of the FSXA pattern library is populated with the data from the SSR context.

```typescript
import { FSXAActions } from "fsxa-pattern-library";

nuxtServerInit(_, { store }) {
    // if you do have your nextServerInit already in place make sure to include this line
    this.dispatch(FSXAActions.hydrateClient, store.state.fsxa);
},
```

### Create your fsxa.config

There are multiple ways to configure this module.

#### nuxt.config

Provide your configuration by adding an fsxa-key to your nuxt.config.js or nuxt.config.ts.

```javascript
...
fsxa: {
    // your configuration
}
...
```

#### fsxa.config

Provide your configuration by creating an fsxa.config.ts / fsxa.config.js in your root directory.

```javascript
export default {
  // your configuration
};
```

#### Options

| Key                     | Default                 | Description                                                                                                                                                                                                                                                                      |
| ----------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| components.sections     | '~/components/sections' | The folder where all your section-components are located at. You can define an index-file which will directly map keys to section-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit.   |
| components.richtext     | '~/components/richtext' | The folder where all your richtext-components are located at. You can define an index-file which will directly map keys to richtext-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit. |
| components.layouts      | '~/components/layouts'  | The folder where all your layout-components are located at. You can define an index-file which will directly map keys to layout-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit.     |
| components.appLayout    | undefined               | You can provide a component that will override the layout of the application. If you are using TypeScript you should make sure, that you extend the `FSXABaseAppLayout` that is provided by the `fsxa-pattern-library`                                                           |
| components.loader       | undefined               | You can provide a component that will be used while loading. If no component is returned, no loading animation is displayed.                                                                                                                                                     |
| components.page404      | undefined               | You can provide a component that will be used when no matching route could be found. If no component is returned, nothing will be displayed.                                                                                                                                     |
| devMode                 | false                   | Enable devMode in the `fsxa-pattern-library`. See documentation of `fsxa-pattern-library` for more information about this topic.                                                                                                                                                 |
| useErrorBoundaryWrapper | true                    | Enable useErrorBoundaryWrapper in the `fsxa-pattern-library`. See documentation of `fsxa-pattern-library` for more information about this topic.                                                                                                                                 |
| customRoutes            | undefined               | You can provide a path, where your custom routes are defined.                                                                                                                                                                                                                    |
| logLevel                | 3                       | You can provide a level for the logging. <br> `0` = Info, `1` = Log, `2` = Warning, `3` = Error, `4` = None.                                                                                                                                                                     |
| fsTppVersion            | undefined               | _DEPRECATED: use [`FSXA_SNAP_URL`](https://github.com/e-Spirit/fsxa-pattern-library/#snap-url) instead_ You can provide a version for tpp-snap. Check [this](https://www.npmjs.com/package/fs-tpp-api) out for more details.                                                     |
| enableEventStream       | false                   | When enabled, events for `insert`, `replace` and `delete` CaaS documents can be observed and handled. It's currently used in preview mode, to sync updated data in FirstSpirit with the CaaS and the App State.                                                                  |

The LogLevel can also be set by providing an env variable called `FSXA_LOG_LEVEL`. This will be priorized over the configuration file option.

## Legal Notices

FSXA-Nuxt-Module is an example solution of [Crownpeak Technology GmbH](http://www.e-spirit.com), Dortmund, Germany.
The FSXA-Nuxt-Module is subject to the Apache-2.0 license.

## Disclaimer

This document is provided for information purposes only.
Crownpeak Technology may change the contents hereof without notice.
This document is not warranted to be error-free, nor subject to any
other warranties or conditions, whether expressed orally or
implied in law, including implied warranties and conditions of
merchantability or fitness for a particular purpose. Crownpeak Technology
specifically disclaims any liability with respect to this document
and no contractual obligations are formed either directly or
indirectly by this document. The technologies, functionality, services,
and processes described herein are subject to change without notice.
