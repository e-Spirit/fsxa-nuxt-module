import {
  ClientAccessControlConfig,
  ClientContextProviderParams,
} from "fsxa-nuxt-module";
import { UserAuthClientContext } from "./common";

function provideClientAccessControlContext({
  store,
}: ClientContextProviderParams): UserAuthClientContext {
  return {
    token: store.state.myStore.userAuthToken,
  };
}

export default {
  clientContextProvider: provideClientAccessControlContext,
} as ClientAccessControlConfig<UserAuthClientContext>;
