// eslint-disable-next-line
const express = require("express");
// eslint-disable-next-line
const FSXAApi = require("fsxa-api");
require("cross-fetch/polyfill");

const fsxaAPI = new FSXAApi(process.env.FSXA_MODE, {
  mode: "remote",
  config: {
    apiKey: process.env.FSXA_API_KEY,
    caas: process.env.FSXA_CAAS,
    projectId: process.env.FSXA_PROJECT_ID,
    navigationService: process.env.FSXA_NAVIGATION_SERVICE,
  },
});

const app = express();
app.set("trust proxy", true);
const fsxaRoutes = express.Router();
fsxaRoutes.get("/pages/:pageId", async (req, res) => {
  if (!req.query.language)
    return res.json({
      error: "Please specify a language through ?language=",
    });
  const response = await fsxaAPI.fetchPage(
    req.params.pageId,
    req.query.language as string,
  );
  res.json(response);
});

fsxaRoutes.get("/navigation", async (req, res) => {
  if (!req.query.language)
    return res.json({ error: "Please specify a language through ?language=" });
  const response = await fsxaAPI.fetchNavigation(req.query.language as string);
  res.json(response);
});

fsxaRoutes.get("/gca-pages/:uid?", async (req, res) => {
  if (!req.query.language)
    return res.json({ error: "Please specify a language through ?language=" });
  if (req.params.uid) {
    const response = await fsxaAPI.fetchGCAPage(
      req.query.language as string,
      req.params.uid,
    );
    return res.json(response);
  }
  const response = await fsxaAPI.fetchGCAPages(req.query.language as string);
  res.json(response);
});

app.use("/fsxa", fsxaRoutes);
module.exports = app;
