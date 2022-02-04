import { getFSXAModule } from "fsxa-pattern-library";

export default function (ctx, inject) {
  const envConfig = ctx.$config

  const path = `${envConfig.FSXA_API_BASE_URL ? `/${envConfig.FSXA_API_BASE_URL}` : ''}/api/fsxa`

  const proxyApiConfig = {
    clientUrl: path,
    serverUrl: `http://localhost:3000${path}`,
    logLevel: "<%= options.logLevel %>",
    contentMode: envConfig.FSXA_MODE
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
