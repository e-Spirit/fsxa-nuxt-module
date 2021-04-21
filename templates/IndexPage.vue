<template>
  <fsxa-app
    :devMode="devMode"
    :currentPath="this.$router.currentRoute.path"
    defaultLocale="<%= options.defaultLocale %>"
    :components="components"
    :handleRouteChange="handleRouteChange"
    fsTppVersion="<%= options.fsTppVersion %>"
  />
</template>

<script>
import { FSXAApp } from "fsxa-pattern-library";
import DevModeInfo from "./DevModeInfo.vue"

let AppLayout, Loader, Page404;
<% if (options.components.appLayout) {%>AppLayout = require("<%= options.components.appLayout %>").default;<% } %>
<% if (options.components.loader) {%>Loader = require("<%= options.components.loader %>").default;<% } %>
<% if (options.components.page404) {%>Page404 = require("<%= options.components.page404 %>").default;<% } %>


const removeExtension = (str) => str.split(".").slice(0, -1).join(".");
const transformFilePathToComponentName = (str) => {
  const pathArray = str ? str.split("/") : [];
  return pathArray.filter(path => path !== ".").map(path => toSnakeCase(path)).join(".").replace(/\.index$/gm, "");
}
const toSnakeCase = (str) => {
  return str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]\/*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("_");
}

const getComponentMap = (files) => {
  if (files.keys().includes("./index.ts")) return files("./index.ts").default;
  if (files.keys().includes("./index.js")) return files("./index.js").default;

  return files.keys().reduce((result, fileName) => {
    const file = removeExtension(fileName);
    return {
      ...result,
      [transformFilePathToComponentName(file)]: files(fileName).default,
    };
  }, {});
};

const richtext = getComponentMap(
  require.context(
    "<%= options.components.richtext %>",
    true,
    /[a-zA-Z0-9]+\.(js|ts|tsx|jsx|vue)$/
  )
);
const layouts = getComponentMap(
  require.context(
    "<%= options.components.layouts %>",
    true,
    /[a-zA-Z0-9]+\.(js|ts|tsx|jsx|vue)$/
  )
);
const sections = getComponentMap(
  require.context(
    "<%= options.components.sections %>",
    true,
    /[a-zA-Z0-9]+\.(js|ts|tsx|jsx|vue)$/
  )
);

export default {
  name: "FSXAModule",
  components: {
    "fsxa-app": FSXAApp,
  },
  props: ["devMode"],
  computed: {
    components() {
      return {
        appLayout: AppLayout || undefined,
        loader: Loader || undefined,
        page404: Page404 || undefined,
        richtext,
        layouts,
        sections,
        devModeInfo: DevModeInfo
      }
    }
  },
  methods: {
    handleRouteChange(route) {
      this.$router.push({ path: route });
    },
  },
};
</script>
