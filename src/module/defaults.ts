import { FSXAModuleOptions } from ".";
import path from "path";

const defaults: Partial<FSXAModuleOptions> = {
  // add options in here
  // allow disabling of specific routes and so on
  components: {
    sections: path.join("~", "components", "fsxa", "sections"),
    layouts: path.join("~", "components", "fsxa", "layouts"),
    richtext: path.join("~", "components", "fsxa", "richtext"),
  },
  devMode: false,
  useErrorBoundaryWrapper: true,
};
export default defaults;
