import { Module } from "@nuxt/types";
import { join, resolve } from "path";
import * as fs from "fs";
import defaults from "./defaults";
import merge from "lodash.merge";
import createMiddleware, { CustomRoute } from "../api";
import { FSXARemoteApi, LogLevel, RemoteProjectConfiguration } from "fsxa-api";
import { FSXAContentMode } from "fsxa-api/dist/types/enums";
import { ClientAccessControlConfig, ServerAccessControlConfig } from "..";
import { NuxtOptionsWatchers } from "@nuxt/types/config/watchers";

/**
 * @member apiAccessControl - Settings for API access control (EXPERIMENTAL)
 * @member apiAccessControl.client - Optional path to file that exports {@link ClientAccessControlConfig ClientAccessControlConfig} (EXPERIMENTAL)
 * @member apiAccessControl.server - Optional path to file that exports {@link ServerAccessControlConfig ServerAccessControlConfig} (EXPERIMENTAL)
 * @member fsTppVersion DEPRECATED: use `FSXA_SNAP_URL` instead {@link https://github.com/e-Spirit/fsxa-pattern-library/#snap-url}
 */
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
  maxReferenceDepth?: number;
  logLevel?: LogLevel;
  defaultLocale: string;
  devMode?: boolean;
  useErrorBoundaryWrapper?: boolean;
  customRoutes?: string;
  fsTppVersion?: string;
  enableEventStream?: boolean;
  apiAccessControl?: {
    server?: string;
    client?: string;
  };
}
// Default values from ENV variables have the highest priority
const LOG_LEVEL: string = process.env.FSXA_LOG_LEVEL;
const LOCALE: string = process.env.FSXA_LOCALE;

const FSXAModule: Module<FSXAModuleOptions> = function (moduleOptions) {
  // try to access config file
  let fileConfiguration = {};
  try {
    const configFilePath = getConfigurationFilePath(this.options.srcDir);
    if (configFilePath) {
      // eslint-disable-next-line
      fileConfiguration = require(configFilePath).default;
      // ENV variable will take the priority
      if (LOG_LEVEL && LOG_LEVEL in LogLevel) {
        fileConfiguration["logLevel"] = LOG_LEVEL;
      }
      if (LOCALE) {
        fileConfiguration["defaultLocale"] = LOCALE;
      }
      // watch config file
      if (this.nuxt.options.dev) {
        this.nuxt.options.watch.push(configFilePath);
      }
    }
  } catch (error) {
    throw new Error(
      `[FSXA-Module] Could not read configuration file: fsxa.config.(ts/js): ${error.message}`,
    );
  }

  // merge options from different sources
  const options: FSXAModuleOptions = merge(
    {},
    defaults,
    moduleOptions,
    this.options.fsxa,
    fileConfiguration,
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
        useErrorBoundaryWrapper: options.useErrorBoundaryWrapper,
      },
    });
  };

  const customRoutes: CustomRoute[] = [];
  if (options.customRoutes) {
    const customRoutesPath = this.nuxt.resolver.resolveAlias(
      options.customRoutes,
    );
    if (this.nuxt.options.dev) {
      addWatchIgnore(this.options.watchers, customRoutesPath);
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

  const requiredEnvVariables = [
    "FSXA_API_KEY",
    "FSXA_CAAS",
    "FSXA_PROJECT_ID",
    "FSXA_NAVIGATION_SERVICE",
    "FSXA_MODE",
    "FSXA_TENANT_ID",
  ];

  const missingEnvVariables = requiredEnvVariables.filter(
    (v) => nuxtRuntimeConfig[v] === undefined || !nuxtRuntimeConfig[v],
  );
  if (missingEnvVariables.length !== 0) {
    throw new Error(
      `[FSXA-Module] Initialization failed. Required environment variables ${missingEnvVariables.join()} are missing.`,
    );
  }

  let serverAccessControlConfig: ServerAccessControlConfig<unknown> | undefined;
  if (options.apiAccessControl?.server) {
    const configPath = this.nuxt.resolver.resolveAlias(
      options.apiAccessControl.server,
    );
    if (this.nuxt.options.dev) {
      addWatchIgnore(this.options.watchers, configPath);
    }
    serverAccessControlConfig = require(configPath).default;
  }

  const fsxaApi = new FSXARemoteApi({
    apikey: nuxtRuntimeConfig.FSXA_API_KEY,
    caasURL: nuxtRuntimeConfig.FSXA_CAAS,
    navigationServiceURL: nuxtRuntimeConfig.FSXA_NAVIGATION_SERVICE,
    tenantID: nuxtRuntimeConfig.FSXA_TENANT_ID,
    maxReferenceDepth:
      Number(nuxtRuntimeConfig.FSXA_MAX_REFERENCE_DEPTH) ||
      options.maxReferenceDepth,
    projectID: nuxtRuntimeConfig.FSXA_PROJECT_ID,
    // Nuxt automatically JSON.parses object-like .env vars, so no parsing is needed here
    remotes:
      (nuxtRuntimeConfig.FSXA_REMOTES as unknown as RemoteProjectConfiguration) ||
      {},
    contentMode: nuxtRuntimeConfig.FSXA_MODE as FSXAContentMode,
    filterOptions: {
      navigationItemFilter: serverAccessControlConfig?.navigationItemFilter,
      caasItemFilter: serverAccessControlConfig?.caasItemFilter,
    },
    logLevel: options.logLevel,
  });

  fsxaApi.enableEventStream(options.enableEventStream);

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
      fsxaApi,
    ),
  });

  if (options.apiAccessControl?.client) {
    const clientAccessControlConfigPath = this.nuxt.resolver.resolveAlias(
      options.apiAccessControl.client,
    );
    if (this.nuxt.options.dev) {
      addWatchIgnore(this.options.watchers, clientAccessControlConfigPath);
    }
    this.options.build.transpile.push(clientAccessControlConfigPath);
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
      clientAccessControlConfigPath: options.apiAccessControl?.client,
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

function addWatchIgnore(watchers: NuxtOptionsWatchers, configPath: string) {
  const ignored = watchers.webpack.ignored;
  if (Array.isArray(ignored)) {
    watchers.webpack.ignored = [...ignored, new RegExp(configPath)];
  } else if (typeof ignored === "string") {
    watchers.webpack.ignored = [`${ignored}`, new RegExp(configPath)];
  } else if (typeof ignored === "undefined" || ignored == null) {
    watchers.webpack.ignored = [new RegExp(configPath)];
  }
}
