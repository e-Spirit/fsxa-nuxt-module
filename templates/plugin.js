import { getFSXAModule } from "fsxa-pattern-library";

export default function (ctx, inject) {
  const fsxaModule = getFSXAModule(process.env.FSXA_MODE, {
    mode: "proxy",
    baseUrl: {
      client: "/api/fsxa",
      server: `http://${process.env.NUXT_HOST || "localhost"}:${
        process.env.NUXT_PORT || 3000
      }/api/fsxa`,
    },
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
