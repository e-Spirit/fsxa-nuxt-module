import { FSXAModuleOptions } from ".";
import path from "path";

const defaults: Partial<FSXAModuleOptions> = {
  // add options in here
  // allow disabling of specific routes and so on
  includeFSXAUI: true,
  sections: path.join("~", "components", "sections"),
  layouts: path.join("~", "components", "layouts"),
  devMode: false,
};
export default defaults;
