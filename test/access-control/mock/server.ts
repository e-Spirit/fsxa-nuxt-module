import express from "express";
import { Server } from "http";

const navigationResponse = require("./navigation-response.json");
const emptyCaasResponse = require("./caas-empty-response.json");
const caasHomepageResponse = require("./caas-homepage-response.json");
const caasImageResponse = require("./caas-image-response.json");

function createMockServerApp({ navigationApiPath, caasApiPath }) {
  const app = express();
  app.use(express.json());
  app.get(`${navigationApiPath}/*`, (_, res) => {
    return res.json(navigationResponse);
  });
  app.get(`${caasApiPath}/*`, (req, res) => {
    if (req.url.includes("ProjectProperties")) {
      return res.json(emptyCaasResponse);
    } else if (req.url.includes("c8a158a3-2ba3-427c-a7e4-7d41d9844464")) {
      return res.json(caasHomepageResponse);
    } else if (req.url.includes("e4d1dead-7b0b-4128-b446-5e08bb0c37fa")) {
      return res.json(caasImageResponse);
    }
    return res.sendStatus(404);
  });
  return app;
}

export function registerMockServer({
  mockServerPort,
  navigationApiPath,
  caasApiPath,
}) {
  let mockServer: Server;
  beforeAll(() => {
    mockServer = createMockServerApp({
      navigationApiPath,
      caasApiPath,
    }).listen(mockServerPort);
  });

  afterAll(() => {
    if (mockServer) mockServer.close();
  });
}
