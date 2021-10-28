import { getFSXAModule } from "fsxa-pattern-library";

export default function (ctx, inject) {
  const baseURL = `http://${process.env.NUXT_HOST || "localhost"}:${process.env.NUXT_PORT || 3000}`
  const path = process.env.FSXA_API_BASE_URL ? `/${process.env.FSXA_API_BASE_URL}/api/fsxa` : "/api/fsxa"
  const fsxaModule = getFSXAModule(process.env.FSXA_MODE, {
    mode: "proxy",
    baseUrl: {
      client: path,
      server: baseURL + path
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
