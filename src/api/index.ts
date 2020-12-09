import express, { Express, Request, Response, NextFunction } from "express";
import { FSXAApi } from "fsxa-api";
import getExpressRouter from "fsxa-api/dist/lib/integrations/express";
import { ServerMiddleware } from "@nuxt/types";
require("cross-fetch/polyfill");

export interface MiddlewareContext {
  fsxaAPI: FSXAApi;
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
export interface MiddlewareOptions {
  customRoutes?: CustomRoute[];
}
const createMiddleware = (
  options: MiddlewareOptions,
  api: FSXAApi,
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
    return app(req as Request, res as Response, next);
  };
  return middleware;
};
export default createMiddleware;
// eslint-disable-next-line
export const meta = require("./../../package.json");
