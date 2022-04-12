import { setupTest, url } from "@nuxt/test-utils";
import { registerMockServer } from "./mock/server";
import path from "path";
import { createNuxtTestOptions } from "./utils";

const mockServerPort = 3001;
const navigationApiPath = "/api/navigation";
const caasApiPath = "/api/caas";

describe("navigating with unauthorized user credentials", () => {
  registerMockServer({ mockServerPort, navigationApiPath, caasApiPath });

  setupTest(
    createNuxtTestOptions({
      nuxtPort: 3000,
      mockServerPort,
      navigationApiPath,
      caasApiPath,
      apiAccessControl: {
        server: path.join("~", "access-control", "server"),
        client: path.join("~", "access-control", "attach-unauthorized-user"),
      },
    }),
  );

  test("is prohibited for secured navigation route", async () => {
    const result = await fetch(url("/"));
    const text = await result.text();
    expect(text).toContain("404");
    expect(text).not.toContain(
      "currentNavigationNode:5a7cdf48-5031-4fcd-b6c7-99e802d0ce57",
    );
  });
});
