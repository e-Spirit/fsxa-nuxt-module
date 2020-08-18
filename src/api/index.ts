import express from "express";
import FSXAApi, { FSXAContentMode } from "fsxa-api";
import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";
import "cross-fetch/polyfill";

const fsxaAPI = new FSXAApi(
  process.env.FSXA_MODE as FSXAContentMode,
  {
    mode: "remote",
    config: {
      apiKey: process.env.FSXA_API_KEY,
      caas: process.env.FSXA_CAAS,
      projectId: process.env.FSXA_PROJECT_ID,
      navigationService: process.env.FSXA_NAVIGATION_SERVICE,
    },
  },
  axios.create({
    adapter: httpAdapter,
  })
);

const app = express();
app.set("trust proxy", true);
const fsxaRoutes = express.Router();
fsxaRoutes.get("/pages/:pageId", async (req, res) => {
  console.log("Calling /pages/:pageId", req);
  if (!req.query.language)
    return res.json({
      error: "Please specify a language through ?language=",
    });
  const response = await fsxaAPI.fetchPage(
    req.params.pageId,
    req.query.language as string
  );
  res.json(response);
});

fsxaRoutes.get("/navigation", async (req, res) => {
  console.log("Calling /navigation", req);
  if (!req.query.language)
    return res.json({ error: "Please specify a language through ?language=" });
  const response = await fsxaAPI.fetchNavigation(req.query.language as string);
  res.json(response);
});

fsxaRoutes.get("/gca-pages/:uid?", async (req, res) => {
  console.log("Calling /gca-pages/:uid?", req);
  if (!req.query.language)
    return res.json({ error: "Please specify a language through ?language=" });
  if (req.params.uid) {
    const response = await fsxaAPI.fetchGCAPage(
      req.query.language as string,
      req.params.uid
    );
    return res.json(response);
  }
  const response = await fsxaAPI.fetchGCAPages(req.query.language as string);
  res.json(response);
});

app.use("/fsxa", fsxaRoutes);
export default app;
