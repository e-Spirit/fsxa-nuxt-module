import { NuxtTestOptions } from "@nuxt/test-utils";
import { FSXAModuleOptions } from "../../src/index";
import path from "path";

export function createNuxtTestOptions({
  nuxtPort,
  mockServerPort,
  caasApiPath,
  navigationApiPath,
  apiAccessControl,
}): Partial<NuxtTestOptions> {
  return {
    testDir: __dirname,
    server: true,
    config: {
      ssr: true,
      server: {
        port: nuxtPort,
      },
      publicRuntimeConfig: {
        NUXT_PORT: nuxtPort,
      },
      privateRuntimeConfig: {
        FSXA_API_KEY: "someKey",
        FSXA_CAAS: `http://localhost:${mockServerPort}${caasApiPath}`,
        FSXA_NAVIGATION_SERVICE: `http://localhost:${mockServerPort}${navigationApiPath}`,
        FSXA_PROJECT_ID: "my-project",
        FSXA_MODE: "preview",
        FSXA_TENANT_ID: "my-tenant",
      },
      modules: [
        [
          path.join("..", "..", "src", "module", "index.ts"),
          {
            apiAccessControl,
            components: {
              page404: path.join("~", "components", "fsxa", "Page404"),
            },
          } as FSXAModuleOptions,
        ],
      ],
    },
  };
}
