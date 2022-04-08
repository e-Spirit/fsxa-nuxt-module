import { getFSXAModule } from "fsxa-pattern-library";
import { FSXAApiSingleton, FSXAProxyApi } from "fsxa-api"

export default function (ctx, inject) {
  const envConfig = ctx.$config

  const path = `${envConfig.FSXA_API_BASE_URL ? `/${envConfig.FSXA_API_BASE_URL}` : ''}/api/fsxa`
  const nuxtHost = envConfig.NUXT_HOST || 'localhost'
  const nuxtPort = envConfig.NUXT_PORT || '3000'
  const proxyApiConfig = {
    clientUrl: path,
    serverUrl: `http://${nuxtHost}:${nuxtPort}${path}`,
    logLevel: "<%= options.logLevel %>",
    contentMode: envConfig.FSXA_MODE
  }

  FSXAApiSingleton.init(
    new FSXAProxyApi(process.client ? proxyApiConfig.clientUrl : proxyApiConfig.serverUrl),
    {
      logLevel: proxyApiConfig.logLevel,
      enableEventStream: "<%= options.enableEventStream %>" === "true"
    }
  )
  const fsxaModule = getFSXAModule({ mode: 'proxy', config: proxyApiConfig });

  if (typeof ctx.store === "undefined") {
    throw new Error(
      "[FSXA-Module] Could not find Vuex-Store. Please initialize it.",
    );
  } else {
    ctx.store.registerModule("fsxa", {
      namespaced: true,
      ...fsxaModule,
    });
  }
}
