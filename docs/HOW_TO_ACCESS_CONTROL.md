# How-to: Restrict access to FSXA API data

This document guides you through each step that is necessary for restricting access to FSXA API data.

This guide uses the example of a group-based access control (GBAC) approach to restricting access to `NavigationItem`s and `Dataset`s based on permission data (permitted groups) included in the FSXA data. However, the same underlying approach can be used to limit access to other kinds of API data (e.g. `Page`, `GCAPage`, etc.) using different models (e.g. role-based access control, time-based access control, etc.).

## Table of Contents

- [How-to: Restrict access to FSXA API data](#how-to-restrict-access-to-fsxa-api-data)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Restrict access by filtering data](#restrict-access-by-filtering-data)
    - [navigationItemFilter](#navigationitemfilter)
    - [caasItemFilter](#caasitemfilter)
    - [Register hooks](#register-hooks)
    - [Provide client-side data](#provide-client-side-data)
  - [Advanced: Activate during SSR](#advanced-activate-during-ssr)
  - [Advanced: Reuse computed authorization data](#advanced-reuse-computed-authorization-data)
  - [Advanced: Enforce access control in customRoutes](#advanced-enforce-access-control-in-customroutes)

## Prerequisites

- Token or session ID stored in the client (that grants access or stores identity and/or authorization related data)
- A way to verify the identity of and retrieve authorization data for a token or session ID.

## Restrict access by filtering data

The FSXA API provides access to two types of data, `NavigationItem`s and `CaasItem`s.
To restrict access to FSXA data, the two hooks `navigationItemFilter` and `caasItemFilter` can be implemented an registered.

### navigationItemFilter

To restrict access to `NavigationItem`s, a `navigationItemFilter` hook can be implemented. The hook is invoked on each `fetchNavigation` API call.

```typescript
async function filterNavigationItems({
  navigationItems,
  filterContext: userAuthContext,
}: NavigationItemFilterParams<UserAuthClientContext>): Promise<
  NavigationItem[]
> {
  const userGroups = retrieveUserGroups(userAuthContext?.token);
  return navigationItems.filter((item: NavigationItem) => {
    const allowedGroups = item.permissions?.allowed || [];
    return isAllowed(userGroups, allowedGroups);
  });
}
```

<p align="center">Excerpt from file: <a href="examples/access-control/server.ts">examples/access-control/server.ts</a></p>

> **NOTE:** The specific implementation of verifying the user identity and retrieving user groups was intentionally ommitted as it is very specific to the authentication solution used.

> **NOTE:** All attributes of the API response type `NavigationData` that include the individual `NavigationItem`s (such as `seoRouteMap` or `idMap`) are computed with the filtered data.

> **NOTE:** The filter hook retrieves a list that's essentially a flattend view of all `NavigationItem`s, which exist as a tree-like structure. This means that child nodes are not automatically excluded when excluding their parent nodes. To ensure descendant nodes are also excluded, either the related data needs to be inherited to descendant nodes (e.g. by using FistSpirits meta data inheritance) or the `parentIds` attribute of each descendant node can be assessed.

As seen in this example, the hook also retrieves a `filterContext` parameter, which contains context data that was passed from the API call site from the client. In this example, a user auth token is used to retrieve all groups that the user is part of to decide whether access to `NavigationItem`s is granted.

### caasItemFilter

The same approach can be used for `CaasItem`s using the `caasItemFilter` hook, as demonstrated in the following example. The hook is invoked for the API functions `fetchElement`, `fetchByFilter` and `fetchProjectProperties`.

```typescript
async function filterCaasItems({
  caasItems,
  filterContext: userAuthContext,
}: CaasItemFilterParams<UserAuthClientContext>): Promise<(CaasItem | any)[]> {
  const userGroups = retrieveUserGroups(userAuthContext?.token);
  return caasItems.filter((item: CaasItem) => {
    switch (item.type) {
      case "Dataset":
        const datasetPermission = item.data.tt_permissions as DataEntry;
        if (datasetPermission && isPermission(datasetPermission)) {
          const firstPermission = datasetPermission.value[0];
          const allowedGroups = firstPermission.allowed.map(
            (group) => group.groupId,
          );
          return isAllowed(userGroups, allowedGroups);
        }
        return false;
      default:
        return true;
    }
  });
}
```

<p align="center">Excerpt from file: <a href="examples/access-control/server.ts">examples/access-control/server.ts</a></p>

> **NOTE:** The filter hook is also invoked for any referenced `CaasItem`s that are automatically resolved. All nested filter invocations have access to the original `filterContext`.

> **NOTE:** When relying on data from any mapped data types, be careful not to use the `keys` parameter when requesting data from the FSXA API as that will skip the mapping and respond with raw CaaS data.

### Register hooks

Finally, the hooks have to be exported using a default export.

```typescript
export default {
  navigationItemFilter: filterNavigationItems,
  caasItemFilter: filterCaasItems,
} as ServerAccessControlConfig<UserAuthClientContext>;
```

<p align="center">Excerpt from file: <a href="examples/access-control/server.ts">examples/access-control/server.ts</a></p>

To enable these hooks, the file containing the `ServerAccessControlConfig` needs to be registered in the `fsxa.config.ts`.

```typescript
export default {
  ..
  apiAccessControl: {
    server: '~/access-control/server'
  },
}
```

<p align="center">Excerpt from file: fsxa.config.ts</p>

### Provide client-side data

In most cases the `FSXAProxyApi` is used to make FSXA API requests as most code can potentially be executed in a browser context (except code that is exclusively run on server-side, such as serverMiddleware, customRoutes, etc.).

To ease maintainability and avoid code duplication when it comes to attaching client side data to each call, a `clientContextProvider` can be used. The provider is automatically called for each API call and the result is attached to the request.

```typescript
function provideClientAccessControlContext({
  store,
}: ClientContextProviderParams): UserAuthClientContext {
  return {
    token: store.state.myStore.userAuthToken,
  };
}

export default {
  clientContextProvider: provideClientAccessControlContext,
} as ClientAccessControlConfig<UserAuthClientContext>;
```

<p align="center">Excerpt from file: <a href="examples/access-control/client.ts">examples/access-control/client.ts</a></p>

The `contextProvider` does have access to the Vuex store, which is used in this example to retrieve the user auth token.

Finally, the file containing the `ClientAccessControlConfig` needs to be registered similar to the `ServerAccessControlConfig`.

```typescript
export default {
  ..
  apiAccessControl: {
    server: '~/access-control/server'
    client: '~/access-control/client'
  },
}
```

<p align="center">Excerpt from file: fsxa.config.ts</p>

## Advanced: Activate during SSR

During SSR, any client-side access control data can only be provided through the initial browser request. Although it's possibly to simply render empty content during SSR (which signals missing access) and load any restricted content after hydration, this does bypass some of the benefits of SSR.

To ensure access control is already active during SSR, a feature can be used that all modern browsers support: cookies. Using the previous examples as reference, you need to ensure that the auth token is pre-populated in the store (e.g. using the `nuxtServerInit` hook):

```typescript
async nuxtServerInit({ commit }, { req }) {
  // Parse cookie (e.g. with cookie-universal-nuxt)
  const token = this.$cookies.get('my-cookie-with-token')
  if (token) {
    commit("setUserAuthToken", token);
  }
}
```

<p align="center">Excerpt from file: store/index.ts</p>

## Advanced: Reuse computed authorization data

The previous examples access authorization data related to the user and requested resources by performing time-efficient computations (verifying integrity of a stateless token, e.g. JWT, or simply reading data that's already available, e.g. `CMS_INPUT_PERMISSION` component data).

For authentication solutions that use a stateful or centralized approach, verification of user identity or lookup of authorization data might be expensive. To optimize the performance of the authorization logic, computed authorization data can be cached and reused.

```typescript
..
const cache = new NodeCache({ stdTTL: 30, checkperiod: 30 });

function retrieveUserGroups(userAuthToken?: string): string[] {
  if (userAuthToken) {
    let groups = cache.get<string[]>(userAuthToken);
    if (groups) {
      return groups;
    }
    // Hardcoding anonymous group for all users.
    // Replace with your dynamic logic to compute or fetch auth data about the user.
    groups = ["anonymous"];

    cache.set(userAuthToken, groups)
    return groups;
  } else return ["anonymous"];
}
```

<p align="center">Excerpt from file: <a href="examples/access-control/server-cached.ts">examples/access-control/server-cached.ts</a></p>

> **NOTE:** This example uses the npm package `node-cache` for an in-memory cache implementation. You can use any type of cache implementation that is compatible with a Node.js runtime.

In addition to improving performance of multiple, subsequent API requests this can greatly impact the duration of FSXA API requests that deal with `CaaSItem`s that include a lot of references, where each reference is filtered through the authorization logic.

## Advanced: Enforce access control in customRoutes

When using the FSXA API in `customRoutes` to provide additional functions, access to FSXA API is also automatically restricted.
You do, however, have to provide any client context and pass it along to the respective FSXA API functions so that the access control logic can access the client context.

The following `customRoute` image download example requires the call site to provide a token as part of the `Authorization` header and passes it as client (access control) context to the `fetchElement` FSXA API call.

```typescript
..
export default {
  async handler(context: FSXAMiddlewareContext, req: Request, res: Response) {
    ..
    const [scheme, token] = req.headers.authorization?.split(" ") || [];
    if (!scheme || scheme !== "Bearer" || !token) {
      return res.status(401).json({
        error: "No token provided",
      });
    }
    try {
      const media = await context.fsxaAPI.fetchElement({
        id: req.params.identifier,
        locale: req.query.locale as string,
        filterContext: { token: token } as UserAuthClientContext,
      });
      ..
    } catch (e) {
      res.status(500).json({
        error: (e as Error).message
      })
    }
  },
  route: '/download/:identifier'
}

```

<p align="center">Excerpt from file: <a href="examples/access-control/customRoutes/download.ts">examples/access-control/customRoutes/download.ts</a></p>

> **NOTE:** This example transmits the token through the `Authorization` header to avoid including it in the request URL. This is generally preferred to including secrets in URLs as the latter are much more easily disclosed (through web server logs, browser history, browser bookmarks, etc).

The use site then provides the token as follows.

```typescript
const image = await this.$axios.$get(`/api/download/${myImageId}`, {
  params: { locale: "en_GB" },
  headers: {
    Authorization: `Bearer ${myStore.userAuthToken}`,
  },
});
```

> **NOTE:** Depending on the HTTP client the call will look slightly different.
