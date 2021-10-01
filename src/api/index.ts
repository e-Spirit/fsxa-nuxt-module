import express, { Request, Response, NextFunction } from "express";
import { FSXAApiErrors, FSXARemoteApi, NavigationData } from "fsxa-api";
import getExpressRouter from "fsxa-api/dist/lib/integrations/express";
import { ServerMiddleware } from "@nuxt/types";
require("cross-fetch/polyfill");

export interface MiddlewareContext {
  fsxaAPI: FSXARemoteApi;
}
export type CustomRouteHandler = (
  context: MiddlewareContext,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export interface CustomRoute {
  route: string;
  handler: CustomRouteHandler;
}
const generateSitemap = async (
  fsxaAPI: FSXARemoteApi,
  req: Request,
  res: Response,
) => {
  const host = [req.protocol, "://", req.headers.host].join("");
  try {
    const response: NavigationData | null = await fsxaAPI.fetchNavigation({
      locale: req.params.language,
    });
    const locations = Object.keys(response.seoRouteMap);
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset>
    ${locations
      .map(
        (location) => `
    <url><loc>${host}${location}</loc></url>
`,
      )
      .join("\n")}
  </urlset>`);
  } catch (err) {
    if (err.message === FSXAApiErrors.NOT_FOUND) {
      res.status(404).json({
        error: err.message,
      });
    }
    if (err.message === FSXAApiErrors.UNKNOWN_ERROR) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
};

export interface MiddlewareOptions {
  customRoutes?: CustomRoute[];
}
const createMiddleware = (
  options: MiddlewareOptions,
  api: FSXARemoteApi,
): ServerMiddleware => {
  const middleware: ServerMiddleware = (req, res, next) => {
    const app = express();
    app.set("trust proxy", true);
    app.use("/fsxa", getExpressRouter({ api }));
    (options.customRoutes || []).forEach((customRoute) => {
      app.use(customRoute.route, (req, res, next) => {
        customRoute.handler({ fsxaAPI: api }, req, res, next);
      });
    });
    app.use("/sitemap/:language", (req, res) => generateSitemap(api, req, res));
    return app(req as Request, res as Response, next);
  };
  return middleware;
};
export default createMiddleware;
// eslint-disable-next-line
export const meta = require("./../../package.json");
