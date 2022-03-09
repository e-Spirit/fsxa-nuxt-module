import { Module } from "@nuxt/types";
import { join, resolve } from "path";
import * as fs from "fs";
import defaults from "./defaults";
import merge from "lodash.merge";
import createMiddleware, { CustomRoute } from "../api";
import {
  CustomFilter,
  FSXARemoteApi,
  LogLevel,
  NavigationItem,
  RemoteProjectConfiguration,
} from "fsxa-api";
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
  enableEventStream?: boolean;
  navigationFilter?: <A = unknown, P = unknown>(
    route: NavigationItem,
    auth: A,
    preFilterFetchData: P,
  ) => boolean;
  preFilterFetch: <T = unknown>() => Promise<T>;
  customFilter?: CustomFilter;
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
      enableEventStream: options.enableEventStream,
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

  const nuxtRuntimeConfig: Record<string, string> = {
    ...this.options.publicRuntimeConfig,
    ...this.options.privateRuntimeConfig,
  };

  const mandatoryEnvVariables = [
    nuxtRuntimeConfig.FSXA_API_KEY,
    nuxtRuntimeConfig.FSXA_CAAS,
    nuxtRuntimeConfig.FSXA_PROJECT_ID,
    nuxtRuntimeConfig.FSXA_NAVIGATION_SERVICE,
    nuxtRuntimeConfig.FSXA_MODE,
    nuxtRuntimeConfig.FSXA_TENANT_ID,
  ];

  if (mandatoryEnvVariables.filter((v) => v === undefined).length === 0) {
    // all env vars are defined

    const fsxaAPI = new FSXARemoteApi({
      apikey: nuxtRuntimeConfig.FSXA_API_KEY,
      caasURL: nuxtRuntimeConfig.FSXA_CAAS,
      navigationServiceURL: nuxtRuntimeConfig.FSXA_NAVIGATION_SERVICE,
      tenantID: nuxtRuntimeConfig.FSXA_TENANT_ID,
      projectID: nuxtRuntimeConfig.FSXA_PROJECT_ID,
      // Nuxt automatically JSON.parses object-like .env vars, so no parsing is needed here
      remotes:
        (nuxtRuntimeConfig.FSXA_REMOTES as unknown as RemoteProjectConfiguration) ||
        {},
      contentMode: nuxtRuntimeConfig.FSXA_MODE as FSXAContentMode,
      navigationFilter: options.navigationFilter,
      preFilterFetch: options.preFilterFetch,
      customFilter: options.customFilter,
      logLevel: options.logLevel,
    });

    fsxaAPI.enableEventStream(options.enableEventStream);

    const path = nuxtRuntimeConfig.FSXA_API_BASE_URL
      ? `${nuxtRuntimeConfig.FSXA_API_BASE_URL}/api`
      : "/api";

    // create serverMiddleware
    this.addServerMiddleware({
      path,
      handler: createMiddleware(
        {
          customRoutes,
        },
        fsxaAPI,
      ),
    });
  }

  // Add plugin
  const compiledPlugin = this.addTemplate({
    src: resolve(__dirname, join("..", "..", "templates", "plugin.js")),
    fileName: join("fsxa.js"),
    options: {
      logLevel:
        typeof options.logLevel !== "undefined"
          ? options.logLevel
          : "undefined",
      enableEventStream: !!options.enableEventStream,
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
