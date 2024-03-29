import { Request, Response } from "express";
import { FSXAMiddlewareContext } from "fsxa-nuxt-module";
import { UserAuthClientContext } from "~/access-control/common";

export default {
  async handler(context: FSXAMiddlewareContext, req: Request, res: Response) {
    if (!req.query.locale) {
      return res.status(404).json({
        error:
          "No locale was specified. Please provide it through ?locale query",
      });
    }
    if (!req.params.identifier) {
      return res.status(404).json({
        error: "No identifier was specified",
      });
    }
    const [scheme, token] = req.headers.authorization?.split(" ") || [];
    if (!scheme || scheme !== "Bearer" || !token) {
      return res.status(401).json({
        error: "No token provided",
      });
    }
    try {
      const media = await context.fsxaAPI.fetchElement({
        id: req.params.identifier,
        locale: req.query.locale as string,
        filterContext: { token: token } as UserAuthClientContext,
      });
      if (media.resolutions && media.resolutions.ORIGINAL) {
        return res.redirect(media.resolutions.ORIGINAL.url);
      }
      res.send({
        error: "Unknown media type",
        media,
      });
    } catch (e) {
      res.status(500).json({
        error: (e as Error).message,
      });
    }
  },
  route: "/download-secure/:identifier",
};
