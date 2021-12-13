import { getFSXAModule } from "fsxa-pattern-library";

export default function (ctx, inject) {
  const envConfig = ctx.$config
  const baseURL = `http://${envConfig.NUXT_HOST || "localhost"}:${envConfig.NUXT_PORT || 3000}`
  const path = envConfig.FSXA_API_BASE_URL ? `/${envConfig.FSXA_API_BASE_URL}/api/fsxa` : "/api/fsxa"
  const proxyApiConfig = {
    url: baseURL + path, logLevel: "<%= options.logLevel %>"
  }

  const fsxaModule = getFSXAModule({mode: 'proxy', config: proxyApiConfig});

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
