import { getFSXAModule } from "fsxa-pattern-library";

export default function (ctx, inject) {
  const proxyApiConfig = {url: `http://${process.env.NUXT_HOST || "localhost"}:${
    process.env.NUXT_PORT || 3000
  }/api/fsxa`, logLevel: "<%= options.logLevel %>"}

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
