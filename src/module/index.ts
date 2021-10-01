import { Module } from "@nuxt/types";
import { join, resolve } from "path";
import * as fs from "fs";
import defaults from "./defaults";
import merge from "lodash.merge";
import createMiddleware, { CustomRoute } from "../api";
import { FSXARemoteApi, LogLevel, NavigationItem } from "fsxa-api";
import { FSXAContentMode } from "fsxa-api/dist/types/enums";

export interface FSXAModuleOptions {
  components?: {
    sections?: string;
    layouts?: string;
    richtext?: string;
    appLayout?: string;
    page404?: string;
    loader?: string;
    devModeInfo?: string;
  };
  logLevel?: LogLevel;
  defaultLocale: string;
  devMode?: boolean;
  customRoutes?: string;
  fsTppVersion: string;
  navigationFilter?: <A = unknown, P = unknown>(
    route: NavigationItem,
    auth: A,
    preFilterFetchData: P,
  ) => boolean;
  preFilterFetch: <T = unknown>() => Promise<T>;
}
const FSXAModule: Module<FSXAModuleOptions> = function (moduleOptions) {
  // try to access config file
  let configuration = {};
  try {
    const configFilePath = getConfigurationFilePath(this.options.srcDir);
    if (configFilePath) {
      // eslint-disable-next-line
      configuration = require(configFilePath).default;
      // watch config file
      if (this.nuxt.options.dev) {
        this.nuxt.options.watch.push(configFilePath);
      }
    }
  } catch (error) {
    throw new Error(
      `[FSXA-Module] Could not read configuration file: fsxa.config.(ts/js)`,
    );
  }

  // merge options from different sources
  const options: FSXAModuleOptions = merge(
    {},
    defaults,
    moduleOptions,
    this.options.fsxa,
    configuration,
  );

  const srcDir = resolve(__dirname, "..");

  this.nuxt.hook("build:before", () => {
    this.options.css.unshift(
      require.resolve(
        join("fsxa-pattern-library", "dist", "fsxa-pattern-library.css"),
      ),
    );
    this.extendBuild((config) => {
      config.resolve.alias["fsxa-api$"] = require.resolve("fsxa-api");
      this.options.build.transpile.push(join("fsxa-api", "src"));
      config.resolve.alias["fsxa-pattern-library$"] = require.resolve(
        "fsxa-pattern-library",
      );
      this.options.build.transpile.push(join("fsxa-pattern-library", "src"));
      this.options.build.transpile.push(join("fsxa-pattern-library"));
    });
  });

  // Transpile and alias fsxa src
  this.options.alias["~fsxa"] = srcDir;
  this.options.build.transpile.push(srcDir);

  this.addTemplate({
    src: resolve(__dirname, join("..", "..", "templates", "DevModeInfo.vue")),
    fileName: join("fsxa", "DevModeInfo.vue"),
    options: {
      components: options.components || {},
    },
  });

  // Add compiled IndexPage
  const compiledIndexPage = this.addTemplate({
    src: resolve(__dirname, join("..", "..", "templates", "IndexPage.vue")),
    fileName: join("fsxa", "IndexPage.vue"),
    options: {
      components: options.components || {},
      defaultLocale: options.defaultLocale,
      fsTppVersion: options.fsTppVersion,
    },
  });

  // extend routing configuration and add compiled component
  this.options.router.extendRoutes = (routes, resolve) => {
    routes.push({
      name: "fsxa-page",
      path: "/*",
      component: resolve(this.options.buildDir, compiledIndexPage.dst),
      props: {
        devMode: options.devMode,
      },
    });
  };

  const customRoutes: CustomRoute[] = [];
  if (options.customRoutes) {
    const customRoutesPath = this.nuxt.resolver.resolveAlias(
      options.customRoutes,
    );
    if (this.nuxt.options.dev) {
      this.nuxt.options.watch.push(customRoutesPath);
    }
    this.options.build.transpile.push(customRoutesPath);
    // get files in folder
    const files = fs.readdirSync(customRoutesPath);
    files.forEach((file) => {
      // eslint-disable-next-line
      const customRoute = require(`${customRoutesPath}/${file}`);
      customRoutes.push({
        handler: customRoute.default.handler,
        route: customRoute.default.route,
      });
    });
  }

  const {
    FSXA_API_KEY,
    FSXA_CAAS,
    FSXA_PROJECT_ID,
    FSXA_NAVIGATION_SERVICE,
    FSXA_TENANT_ID,
    FSXA_MODE,
  } = process.env;

  const fsxaAPI = new FSXARemoteApi({
    apikey: FSXA_API_KEY,
    caasURL: FSXA_CAAS,
    contentMode: FSXA_MODE as FSXAContentMode,
    navigationServiceURL: FSXA_NAVIGATION_SERVICE,
    projectID: FSXA_PROJECT_ID,
    tenantID: FSXA_TENANT_ID,
    navigationFilter: options.navigationFilter,
    preFilterFetch: options.preFilterFetch,
    logLevel: options.logLevel,
  });

  // create serverMiddleware
  this.addServerMiddleware({
    path: "/api",
    handler: createMiddleware(
      {
        customRoutes,
      },
      fsxaAPI,
    ),
  });

  // Add plugin
  const compiledPlugin = this.addTemplate({
    src: resolve(__dirname, join("..", "..", "templates", "plugin.js")),
    fileName: join("fsxa.js"),
    options: {
      logLevel:
        typeof options.logLevel !== "undefined"
          ? options.logLevel
          : "undefined",
    },
  });
  this.options.plugins.push(resolve(this.options.buildDir, compiledPlugin.dst));
};
export default FSXAModule;
// eslint-disable-next-line
export const meta = require("./../../package.json");

const getConfigurationFilePath = (srcDir: string): string | null => {
  if (fs.existsSync(join(srcDir, "fsxa.config.ts"))) {
    return join(srcDir, "fsxa.config.ts");
  }
  if (fs.existsSync(join(srcDir, "fsxa.config.js"))) {
    return join(srcDir, "fsxa.config.js");
  }
  return null;
};
