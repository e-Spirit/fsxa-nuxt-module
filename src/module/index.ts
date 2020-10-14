import { Module } from "@nuxt/types";
import { join, resolve } from "path";
import * as fs from "fs";
import defaults from "./defaults";
import merge from "lodash.merge";
import createMiddleware, { CustomRoute } from "../api";
import {
  FSXAApi,
  FSXAContentMode,
  QueryBuilderQuery,
  RegisteredDatasetQuery,
} from "fsxa-api";

export interface FSXAModuleOptions {
  includeFSXAUI?: boolean;
  sections?: string;
  layouts?: string;
  appLayoutComponent?: string;
  navigationComponent?: string;
  loaderComponent?: string;
  devMode?: boolean;
  customRoutes?: string;
  mapDataQuery: (query: RegisteredDatasetQuery) => QueryBuilderQuery[];
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

  // this is the default configuration
  if (
    this.options.dir.store === "store" &&
    isDirEmptyOrNotExisting(join(this.options.srcDir, "store"))
  ) {
    // we are trying to extend the config
    this.options.dir.store = join(srcDir, "store");
  }

  // add fsxa-ui css if allowed
  if (options.includeFSXAUI) {
    //
    this.nuxt.hook("build:before", () => {
      // Use bootstrap-vue source code for smaller prod builds
      // by aliasing 'bootstrap-vue' to the source files
      this.options.css.unshift(
        require.resolve(join("fsxa-ui", "dist", "fsxa-ui.css")),
      );
      this.extendBuild((config) => {
        if (!config.resolve.alias) {
          config.resolve.alias = {};
        }
        // We prepend a $ to ensure that it is only used for
        // `import from 'fsxa-ui'` not `import from 'fsxa-ui/*'`
        config.resolve.alias["fsxa-ui$"] = require.resolve("fsxa-ui");
        this.options.build.transpile.push(join("fsxa-ui", "src"));
      });
    });
  }

  this.options.build.transpile.push(/^fsxa-pattern-library/);

  // Transpile and alias fsxa src
  this.options.alias["~fsxa"] = srcDir;
  this.options.build.transpile.push(srcDir);

  // get absolute paths
  const layoutsFolderExists = fs.existsSync(
    this.nuxt.resolver.resolveAlias(options.layouts),
  );
  const sectionsFolderExists = fs.existsSync(
    this.nuxt.resolver.resolveAlias(options.sections),
  );

  if (this.nuxt.options.dev) {
    this.nuxt.options.watch.push(
      this.nuxt.resolver.resolveAlias(options.sections),
    );
    this.nuxt.options.watch.push(
      this.nuxt.resolver.resolveAlias(options.layouts),
    );
  }

  // Add compiled IndexPage
  const compiledIndexPage = this.addTemplate({
    src: resolve(__dirname, join("..", "..", "templates", "IndexPage.vue")),
    fileName: join("fsxa", "IndexPage.vue"),
    options: {
      layoutsPath: layoutsFolderExists ? options.layouts : undefined,
      sectionsPath: sectionsFolderExists ? options.sections : undefined,
      appLayoutComponent: options.appLayoutComponent,
      navigationComponent: options.navigationComponent,
      loaderComponent: options.loaderComponent,
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

  const fsxaAPI = new FSXAApi(process.env.FSXA_MODE as FSXAContentMode, {
    mode: "remote",
    config: {
      apiKey: process.env.FSXA_API_KEY,
      caas: process.env.FSXA_CAAS,
      projectId: process.env.FSXA_PROJECT_ID,
      navigationService: process.env.FSXA_NAVIGATION_SERVICE,
      tenantId: process.env.FSXA_TENANT_ID,
      mapDataQuery: options.mapDataQuery,
    },
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
    options: {},
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

const isDirEmptyOrNotExisting = (dirname: string) => {
  if (!fs.existsSync(dirname)) return true;
  const files = fs.readdirSync(dirname);
  return files.length === 0;
};
