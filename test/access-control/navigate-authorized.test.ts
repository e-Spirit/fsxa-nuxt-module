import { setupTest, url } from "@nuxt/test-utils";
import { registerMockServer } from "./mock/server";
import path from "path";
import { createNuxtTestOptions } from "./utils";

const mockServerPort = 3001;
const navigationApiPath = "/api/navigation";
const caasApiPath = "/api/caas";

describe("navigating with authorized user credentials", () => {
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

  test("is allowed for secured navigation route", async () => {
    const result = await fetch(url("/"));
    expect(result.ok).toEqual(true);
    const text = await result.text();
    expect(text).not.toContain("404");
    expect(text).toContain(
      "currentNavigationNode:5a7cdf48-5031-4fcd-b6c7-99e802d0ce57",
    );
  });
});
