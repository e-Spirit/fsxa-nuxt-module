import FSXA from "./core/fsxa";
import { FSXAModuleOptions as _FSXAModuleOptions } from "./module";

export type FSXAModuleOptions = _FSXAModuleOptions;

declare module "@nuxt/types" {
  interface Context {
    readonly $fsxa: FSXA;
  }
  interface NuxtAppOptions {
    readonly $fsxa: FSXAModuleOptions;
  }
  interface NuxtOptions {
    fsxa?: Partial<FSXAModuleOptions>;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $fsxa: FSXA;
  }
}

/**declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    auth?: true | false | "guest";
  }
}**/

declare module "vuex/types/index" {
  interface Store<S> {
    $fsxa: FSXA;
  }
}
