import { Module } from "@nuxt/types";
import { join, resolve } from "path";
import * as fs from "fs";
import defaults from "./defaults";
import merge from "lodash.merge";
import defaultApiMiddleware, {
  createMiddleware,
  MiddlewareOptions,
} from "../api";

export interface FSXAModuleOptions {
  appUrl: string;
  includeFSXAUI?: boolean;
  sections?: string;
  layouts?: string;
  appLayoutComponent?: string;
  navigationComponent?: string;
  loaderComponent?: string;
  devMode?: boolean;
  middleware?: MiddlewareOptions;
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

  // create serverMiddleware
  this.addServerMiddleware({
    path: "/api",
    handler: options.middleware
      ? createMiddleware(options.middleware)
      : defaultApiMiddleware,
  });

  if (!options.appUrl) {
    throw new Error(
      "You have to specify appUrl in your fsxa.config.ts. This is the url your app will be deployed at.",
    );
  }

  // Add plugin
  const compiledPlugin = this.addTemplate({
    src: resolve(__dirname, join("..", "..", "templates", "plugin.js")),
    fileName: join("fsxa.js"),
    options: {
      appUrl: options.appUrl,
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

const isDirEmptyOrNotExisting = (dirname: string) => {
  if (!fs.existsSync(dirname)) return true;
  const files = fs.readdirSync(dirname);
  return files.length === 0;
};