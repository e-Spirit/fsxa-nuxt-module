import express, { Express, Request, Response } from "express";
import FSXAApi from "fsxa-api";
import { ServerMiddleware } from "@nuxt/types";
require("cross-fetch/polyfill");

const fsxaAPI = new FSXAApi(
  process.env.FSXA_MODE as import("fsxa-api").FSXAContentMode,
  {
    mode: "remote",
    config: {
      apiKey: process.env.FSXA_API_KEY,
      caas: process.env.FSXA_CAAS,
      projectId: process.env.FSXA_PROJECT_ID,
      navigationService: process.env.FSXA_NAVIGATION_SERVICE,
      tenantId: process.env.FSXA_TENANT_ID,
    },
  },
);

export interface MiddlewareContext {
  fsxaAPI: FSXAApi;
}
export type CustomRouteHandler = (
  context: MiddlewareContext,
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction,
) => void;

export interface CustomRoute {
  route: string;
  handler: CustomRouteHandler;
}
export interface MiddlewareOptions {
  customRoutes?: CustomRoute[];
}
const defaultOptions: MiddlewareOptions = {};

export const createMiddleware = (
  options: MiddlewareOptions,
): ServerMiddleware => {
  const middleware: ServerMiddleware = (req, res, next): Express => {
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
      const { defaultLocale, initialPath } = req.query;
      if (!defaultLocale)
        return res.json({
          error: "Please specify a fallback locale through ?defaultLocale=",
        });
      const response = await fsxaAPI.fetchNavigation(
        initialPath === "null" || !initialPath ? null : (initialPath as string),
        defaultLocale as string,
      );
      res.json(response);
    });

    fsxaRoutes.get("/gca-pages/:uid?", async (req, res) => {
      if (!req.query.language)
        return res.json({
          error: "Please specify a language through ?language=",
        });
      if (req.params.uid) {
        const response = await fsxaAPI.fetchGCAPage(
          req.query.language as string,
          req.params.uid,
        );
        return res.json(response);
      }
      const response = await fsxaAPI.fetchGCAPages(
        req.query.language as string,
      );
      res.json(response);
    });
    fsxaRoutes.get("*", (req, res) => {
      return res.json({
        error: "Could not find given Route.",
      });
    });
    app.use("/fsxa", fsxaRoutes);
    (options.customRoutes || []).forEach((customRoute) => {
      app.use(customRoute.route, (req, res, next) => {
        customRoute.handler({ fsxaAPI }, req, res, next);
      });
    });
    return app(req as Request, res as Response, next);
  };
  return middleware;
};
export default createMiddleware(defaultOptions);
// eslint-disable-next-line
export const meta = require("./../../package.json");
