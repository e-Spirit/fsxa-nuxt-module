import { getFSXAModule } from "fsxa-pattern-library";

export default function (ctx, inject) {
  const envConfig = ctx.$config

  const path = `${envConfig.FSXA_API_BASE_URL ? `/${envConfig.FSXA_API_BASE_URL}` : ''}/api/fsxa`
  let url = path
  if (typeof window === "undefined") {
    // server-side rendering
    url = `${envConfig.FSXA_HOST || "http://localhost"}:${envConfig.FSXA_PORT || 3000}${url}`
  }

  const proxyApiConfig = {
    url,
    logLevel: "<%= options.logLevel %>",
    contentMode: envConfig.FSXA_MODE,
    enableEventStream: "<%= options.enableEventStream %>" === "true"
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
