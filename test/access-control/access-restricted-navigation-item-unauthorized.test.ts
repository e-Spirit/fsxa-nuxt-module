import { setupTest, url } from "@nuxt/test-utils";
import { registerMockServer } from "./mock/server";
import path from "path";
import { createNuxtTestOptions } from "./utils";

const mockServerPort = 3001;
const navigationApiPath = "/api/navigation";
const caasApiPath = "/api/caas";

describe("access to navigation items with unauthorized user", () => {
  registerMockServer({ mockServerPort, navigationApiPath, caasApiPath });

  setupTest(
    createNuxtTestOptions({
      nuxtPort: 3000,
      mockServerPort,
      navigationApiPath,
      caasApiPath,
      apiAccessControl: {
        server: path.join("~", "access-control", "server"),
        client: path.join("~", "access-control", "attach-customer-user"),
      },
    }),
  );

  test("is restricted", async () => {
    const result = await fetch(url("/"));
    const text = await result.text();
    expect(text).toContain("navigationData:");
    expect(text).not.toContain("c4bfd8cd-9daf-44ab-92d1-c4a38c1088ec");
  });
});
