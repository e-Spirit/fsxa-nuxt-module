# FSXA-Nuxt-Module

This module is integrating the fsxa-pattern-library. Have a look at the documentation as well.

## Getting Started

### Installation

```bash
# npm
npm install fsxa-nuxt-module --save

# yarn
yarn add fsxa-nuxt-module
```

### Initialize Store

In order for the FSXA module of the FSXA pattern library to be registered with the Vuex store, it is necessary that Nuxt initializes Vuex already.
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

| Key      | Default                 | Description                                                                                                                                                                                                                                                                    |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| sections | '~/components/sections' | The folder where all your section-components are located at. You can define an index-file which will directly map keys to section-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit. |
| layouts  | '~/components/layouts'  | The folder where all your layout-components are located at. You can define an index-file which will directly map keys to layout-components. If no index file exists the filenames will be transformed to snake_case and are matched against the key provided by FirstSpirit.   |
| devMode  | false                   | Enable devMode in the `fsxa-pattern-library`. See documentation of `fsxa-pattern-library` for more information about this topic.                                                                                                                                               |

### Starting Nuxt

```bash
npm run dev
```
