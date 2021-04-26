import { getFSXAModule } from "fsxa-pattern-library";

export default function (ctx, inject) {
  const fsxaModule = getFSXAModule(process.env.FSXA_MODE, {
    mode: process.static ? "remote" : "proxy",
    baseUrl: process.static
      ? undefined
      : {
          client: "/api/fsxa",
          server: `http://${process.env.NUXT_HOST || "localhost"}:${
            process.env.NUXT_PORT || 3000
          }/api/fsxa`,
        },
    config: process.static
      ? {
          apiKey: `${process.env.FSXA_API_KEY}`,
          navigationService: `${process.env.FSXA_NAVIGATION_SERVICE}`,
          caas: `${process.env.FSXA_CAAS}`,
          tenantId: `${process.env.FSXA_TENANT_ID}`,
          mode: `${process.env.FSXA_MODE}`,
          projectId: `${process.env.FSXA_PROJECT_ID}`,
        }
      : undefined,
    logLevel: "<%= options.logLevel %>",
  });
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
