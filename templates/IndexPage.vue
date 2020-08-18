<template>
  <fsxa-page
    :dev-mode="devMode"
    :current-path="this.$router.currentRoute.path"
    default-locale="de_DE"
    :layouts="layouts"
    :sections="sections"
    :locales="locales"
    :handle-route-change="handleRouteChange"
  ></fsxa-page>
</template>

<script>
import { FSXAPage } from "fsxa-pattern-library";

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
      [toSnakeCase(file)]: files(fileName).default,
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
  },
  methods: {
    handleRouteChange(route) {
      this.$router.push({ path: route });
    },
  },
};
</script>
