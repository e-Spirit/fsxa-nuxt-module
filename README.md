# FSXA-Nuxt-Module

This module is integrating the [FSXA-Pattern-Library](https://github.com/e-Spirit/fsxa-pattern-library).

### About the FSXA

The FirstSpirit Experience Accelerator (FSXA) is the hybrid solution of a digital
experience platform, combining a headless approach with enterprise capabilities.
If you are interested in the FSXA check this
[Overview](https://docs.e-spirit.com/module/fsxa/overview/benefits-hybrid/index.html). You can order
a demo [online](https://www.e-spirit.com/us/specialpages/forms/on-demand-demo/).

## Getting Started

### Installation

```bash
# npm
npm install fsxa-nuxt-module

# yarn
yarn add fsxa-nuxt-module
```

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

| Key                  | Default                 | Description                                                                                                                                                                                                                                                                      |
| -------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| components.sections  | '~/components/sections' | The folder where all your section-components are located at. You can define an index-file which will directly map keys to section-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit.   |
| components.richtext  | '~/components/richtext' | The folder where all your richtext-components are located at. You can define an index-file which will directly map keys to richtext-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit. |
| components.layouts   | '~/components/layouts'  | The folder where all your layout-components are located at. You can define an index-file which will directly map keys to layout-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit.     |
| components.appLayout | undefined               |  You can provide a component that will override the layout of the application. If you are using TypeScript you should make sure, that you extend the `FSXABaseAppLayout` that is provided by the `fsxa-pattern-library`                                                          |
| components.loader    | undefined               |  You can provide a component that will be used while loading. If no component is returned, no loading animation is displayed.                                                                                                                                                    |
| components.page404   | undefined               |  You can provide a component that will be used when no matching route could be found. If no component is returned, nothing will be displayed.                                                                                                                                    |
| devMode              | false                   | Enable devMode in the `fsxa-pattern-library`. See documentation of `fsxa-pattern-library` for more information about this topic.                                                                                                                                                 |
| customRoutes         | undefined               |  You can provide a path, where your custom routes are defined.                                                                                                                                                                                                                   |
| logLevel             | 3                       |  You can provide a level for the logging. <br> `0` = Info, `1` = Log, `2` = Warning, `3` = Error, `4` = None.                                                                                                                                                                    |
| fsTppVersion         | 2.2.4                   |  You can provide a version for tpp-snap. Check [this](https://www.npmjs.com/package/fs-tpp-api) out for more details.                                                                                                                                                            |

## Legal Notices

FSXA-Nuxt-Module is a product of [e-Spirit AG](http://www.e-spirit.com), Dortmund, Germany.
The FSXA-Nuxt-Module is subject to the Apache-2.0 license.

## Disclaimer

This document is provided for information purposes only.
e-Spirit may change the contents hereof without notice.
This document is not warranted to be error-free, nor subject to any
other warranties or conditions, whether expressed orally or
implied in law, including implied warranties and conditions of
merchantability or fitness for a particular purpose. e-Spirit
specifically disclaims any liability with respect to this document
and no contractual obligations are formed either directly or
indirectly by this document. The technologies, functionality, services,
and processes described herein are subject to change without notice.
