import { setupTest, url } from "@nuxt/test-utils";
import { registerMockServer } from "./mock/server";
import path from "path";
import { createNuxtTestOptions } from "./utils";

const mockServerPort = 3001;
const navigationApiPath = "/api/navigation";
const caasApiPath = "/api/caas";

describe("access to caas items with authorized user", () => {
  registerMockServer({ mockServerPort, navigationApiPath, caasApiPath });

  setupTest(
    createNuxtTestOptions({
      nuxtPort: 3000,
      mockServerPort,
      navigationApiPath,
      caasApiPath,
      apiAccessControl: {
        server: path.join("~", "access-control", "server"),
        client: path.join("~", "access-control", "attach-registered-user"),
      },
    }),
  );

  test("is not restricted", async () => {
    const result = await fetch(url("/"));
    const text = await result.text();
    expect(text).toContain("pageData:");
    expect(text).toContain("registered-only-image");
    expect(text).toContain("e4d1dead-7b0b-4128-b446-5e08bb0c37fa");
  });
});
