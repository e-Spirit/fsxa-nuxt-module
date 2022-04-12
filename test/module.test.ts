import {
  setupTest,
  expectModuleToBeCalledWith,
  expectModuleNotToBeCalledWith,
  NuxtTestOptions,
} from "@nuxt/test-utils";
import path from "path";

const createNuxtTestOptions = ({
  privateRuntimeConfig,
}): Partial<NuxtTestOptions> => ({
  testDir: __dirname,
  server: true,
  config: {
    privateRuntimeConfig,
    modules: [path.join("..", "..", "src", "module", "index.ts")],
  },
});

describe("module initialization", () => {
  describe("succeeds with all env variables present", () => {
    setupTest(
      createNuxtTestOptions({
        privateRuntimeConfig: {
          FSXA_API_KEY: "someKey",
          FSXA_CAAS: "someUrl",
          FSXA_NAVIGATION_SERVICE: "someUrl",
          FSXA_PROJECT_ID: "someId",
          FSXA_MODE: "preview",
          FSXA_TENANT_ID: "someId",
        },
      }),
    );

    test("should add server middleware api", () => {
      expectModuleToBeCalledWith("addServerMiddleware", {
        path: "/api",
        handler: expect.any(Function),
      });
    });
  });

  // Have to skip for now because test-utils doesn't yet support
  // testing whether modules throw errors during initialization.
  describe.skip("fails due to missing env variables", () => {
    setupTest(
      createNuxtTestOptions({
        privateRuntimeConfig: {},
      }),
    );

    test("should not add server middleware api", () => {
      expectModuleNotToBeCalledWith("addServerMiddleware", {
        path: "/api",
        handler: expect.any(Function),
      });
    });
  });
});
