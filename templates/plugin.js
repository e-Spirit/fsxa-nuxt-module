import { getFSXAModule } from "fsxa-pattern-library";
import { FSXAApiSingleton, FSXAProxyApi } from "fsxa-api";

export default function ({ $config: runtimeConfig, store }) {
  const path = `${
    runtimeConfig.FSXA_API_BASE_URL ? `/${runtimeConfig.FSXA_API_BASE_URL}` : ""
  }/api/fsxa`;
  const nuxtHost = runtimeConfig.NUXT_HOST || 'localhost'
  const nuxtPort = runtimeConfig.NUXT_PORT || '3000'
  const proxyApiConfig = {
    clientUrl: path,
    serverUrl: `http://${nuxtHost}:${nuxtPort}${path}`,
    logLevel: "<%= options.logLevel %>",
    contentMode: runtimeConfig.FSXA_MODE,
  };

  let proxyApiFilterOptions;

  <% if (options.clientAccessControlConfigPath) { %>
  const clientAccessControlContextProvider =
    require("<%= options.clientAccessControlConfigPath %>").default
      .clientContextProvider;
  if (clientAccessControlContextProvider) {
    proxyApiFilterOptions = {
      filterContextProvider: () => {
        return clientAccessControlContextProvider({
          store,
        });
      },
    };
  }
  <% } %>

  FSXAApiSingleton.init(
    new FSXAProxyApi(
      process.client ? proxyApiConfig.clientUrl : proxyApiConfig.serverUrl,
      proxyApiConfig.logLevel,
      proxyApiFilterOptions,
    ),
    {
      logLevel: proxyApiConfig.logLevel,
      enableEventStream: "<%= options.enableEventStream %>" === "true",
    },
  );
  const fsxaModule = getFSXAModule({
    mode: "proxy",
    config: proxyApiConfig,
    snapUrl: runtimeConfig.FSXA_SNAP_URL,
  });

  if (typeof store === "undefined") {
    throw new Error(
      "[FSXA-Module] Could not find Vuex-Store. Please initialize it.",
    );
  } else {
    store.registerModule("fsxa", {
      namespaced: true,
      ...fsxaModule,
    });
  }
}
