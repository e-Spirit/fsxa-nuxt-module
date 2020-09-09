<template>
  <fsxa-page
    :dev-mode="devMode"
    :current-path="this.$router.currentRoute.path"
    default-locale="de_DE"
    :layouts="layouts"
    :sections="sections"
    :locales="locales"
    :handle-route-change="handleRouteChange"
    :appLayoutComponent="appLayoutComponent"
    :navigationComponent="navigationComponent"
    :renderLoader="renderLoader"
  ></fsxa-page>
</template>

<script>
import { FSXAPage } from "fsxa-pattern-library";

let AppLayoutComponent, LoaderComponent, NavigationComponent;
<% if (options.appLayoutComponent) {%>AppLayoutComponent = require("<%= options.appLayoutComponent %>").default;<% } %>
<% if (options.navigationComponent) {%>NavigationComponent = require("<%= options.navigationComponent %>").default;<% } %>
<% if (options.loaderComponent) {%>LoaderComponent = require("<%= options.loaderComponent %>").default;<% } %>

const removeExtension = (str) => str.split(".").slice(0, -1).join(".");
const toSnakeCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("_");

const getComponentMap = (files) => {
  if (files.keys().includes("./index.ts")) return files("./index.ts").default;
  if (files.keys().includes("./index.js")) return files("./index.js").default;

  return files.keys().reduce((result, fileName) => {
    const file = removeExtension(fileName);
    return {
      ...result,
      [toSnakeCase(file).replace(/_index$/g, "")]: files(fileName).default,
    };
  }, {});
};

const layouts = getComponentMap(
  require.context(
    "<%= options.layoutsPath %>",
    true,
    /[a-zA-Z0-9]+\.(js|ts|tsx|jsx|vue)$/
  )
);
const sections = getComponentMap(
  require.context(
    "<%= options.sectionsPath %>",
    true,
    /[a-zA-Z0-9]+\.(js|ts|tsx|jsx|vue)$/
  )
);

export default {
  name: "FSXAPatternLibrary",
  components: {
    "fsxa-page": FSXAPage,
  },
  props: ["devMode"],
  data() {
    return {
      locales: [
        {
          label: "DE",
          value: "de_DE",
        },
        {
          label: "EN",
          value: "en_GB",
        },
      ],
    };
  },
  computed: {
    layouts() {
      return layouts;
    },
    sections() {
      return sections;
    },
    appLayoutComponent() {
      return AppLayoutComponent || undefined;
    },
    navigationComponent() {
      return NavigationComponent || undefined;
    },
    renderLoader() {
      return LoaderComponent ? () => <LoaderComponent /> : undefined;
    }
  },
  methods: {
    handleRouteChange(route) {
      this.$router.push({ path: route });
    },
  },
};
</script>
