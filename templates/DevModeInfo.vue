<template>
  <div class="DevModeInfo">
    <div>
      <span>You can create a new file in the directory:</span>
      <pre class="Code">{{ getPath.name }}</pre>
    </div>
    <div>
      <span
        >File names should be defined in PascalCase. These are subsequently
        converted to snake_case. Folders are also mapped and separate the
        converted identifier with a dot.
        <br />
        The exception here is when an index file is defined. This leads to the
        following mapping:
        <div style="margin-top: 1rem; position: relative">
          <span
            style="color: gray;font-size: 14px;position: absolute;right: 10px;top: 2px;"
            >{{ getPath.directory }}/index.ts</span
          >
        </div>
        <pre style="padding-top: 25px" class="Code">
import YourComponent from "~/path/to/your/component"

export default {
  ...
  "{{ this.componentName }}": YourComponent,
  ...
}
        </pre>
      </span>
    </div>
  </div>
</template>

<script>
import camelCase from "lodash.camelcase";
import startCase from "lodash.startcase";

export default {
  props: {
    type: String,
    componentName: String,
  },
  computed: {
    getPath() {
      switch (this.type) {
        case "section":
          return this.getData("<%- options.components.sections %>");
        case "layout":
          return this.getData("<%- options.components.layouts %>");
        case "richtext":
          return this.getData("<%- options.components.richtext %>");
        default:
          throw new Error(
            'Please define a correct type, either "section" or "layout".',
          );
      }
    },
  },
  methods: {
    getData(directory) {
      const name = (directory + "/" + this.getDirectory()).replace("//", "/");
      return { name, directory };
    },
    getDirectory() {
      const directory = this.componentName.split(".");
      const filename = directory.pop();
      return (
        directory.join("/") +
        "/" +
        startCase(camelCase(filename)).replace(/ /g, "") +
        ".(tsx,vue)"
      );
    },
  },
};
</script>

<style scoped>
.DevModeInfo {
  padding: 10px 0;
}
.Code {
  font-size: 0.75rem;
  --bg-opacity: 1;
  background-color: #1a202c;
  background-color: rgba(26, 32, 44, var(--bg-opacity));
  margin-top: 1rem;
  margin-bottom: 1rem;
}
pre {
  color: #f8f8f2;
  background: none;
  text-shadow: 0 1px rgba(0, 0, 0, 0.3);
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  font-size: 1em;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  padding: 1em;
  margin: 0.5em 0;
  overflow: auto;
  border-radius: 0.3em;
}
</style>
