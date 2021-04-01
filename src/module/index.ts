import { Module } from "@nuxt/types";
import { join, resolve } from "path";
import * as fs from "fs";
import defaults from "./defaults";
import merge from "lodash.merge";
import createMiddleware, { CustomRoute } from "../api";
import { Dataset, FSXAApi, FSXAContentMode, LogLevel } from "fsxa-api";

export interface FSXAModuleOptions {
  components?: {
    sections?: string;
    layouts?: string;
    richtext?: string;
    appLayout?: string;
    page404?: string;
    loader?: string;
  };
  logLevel?: LogLevel;
  defaultLocale: string;
  availableLocales?: string[];
  devMode?: boolean;
  customRoutes?: string;
}

const fetchRoutesForGivenLocale = async (fsxaAPI: FSXAApi, locale: string) => {
  const routes: string[] = [];
  const navigationData = await fsxaAPI.fetchNavigation("/", locale);
  if (navigationData) {
    Object.keys(navigationData.seoRouteMap).forEach((seoRoute) => {
      const navigationItem =
        navigationData.idMap[navigationData.seoRouteMap[seoRoute]];
      routes.push(navigationItem.seoRoute);
    });
    const paths = await Object.values(navigationData.idMap)
      .filter((item) => item.seoRouteRegex)
      .reduce(async (resultP, item) => {
        const result = await resultP;
        const datasets: Dataset[] = (await fsxaAPI.fetchByFilter(
          [],
          locale,
          1,
          1000,
          {
            filter: {
              route: {
                $regex: item.seoRouteRegex,
              },
            },
          },
        )) as Dataset[];
        return [...result, ...datasets.map((route) => route.route)];
      }, Promise.resolve([] as string[]));
    routes.push(...paths);
  }
  return routes;
};

const fetchRoutesForLocales = async (fsxaAPI: FSXAApi, locales: string[]) => {
  const routes = await Promise.all(
    locales.map((locale) => fetchRoutesForGivenLocale(fsxaAPI, locale)),
  );
  return [
    "/",
    // this will remove all duplicate entries
    ...new Set(
      routes.reduce((result, localeRoutes) => [...result, ...localeRoutes], []),
    ),
  ];
};

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

  const fsxaAPI = new FSXAApi(
    process.env.FSXA_MODE as FSXAContentMode,
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
    options.logLevel,
  );

  // Add compiled IndexPage
  const compiledIndexPage = this.addTemplate({
    src: resolve(__dirname, join("..", "..", "templates", "IndexPage.vue")),
    fileName: join("fsxa", "IndexPage.vue"),
    options: {
      components: options.components || {},
      defaultLocale: options.defaultLocale,
      availableLocales: `[${options.availableLocales
        .map((locale) => `"${locale}"`)
        .join(",")}]`,
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

  this.nuxt.hook("render:setupMiddleware", () => {
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
  });

  this.nuxt.hook("generate:extendRoutes", async (routes: any) => {
    // we do need to set all languages that should be rendered
    const locales = options.availableLocales || [options.defaultLocale];
    const routesToAdd = await fetchRoutesForLocales(fsxaAPI, locales);
    routes.push(...routesToAdd.map((route) => ({ route })));
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
