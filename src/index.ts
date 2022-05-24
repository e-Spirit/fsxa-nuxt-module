import { FSXAModuleOptions as _FSXAModuleOptions } from "./module";

import {
  CustomRoute,
  CustomRouteHandler,
  MiddlewareOptions,
  MiddlewareContext,
} from "./api";
import { RemoteApiFilterOptions } from "fsxa-api";
import { Store } from "vuex";

export type FSXACustomRoute = CustomRoute;
export type FSXACustomRouteHandler = CustomRouteHandler;
export type FSXAMiddlewareOptions = MiddlewareOptions;
export type FSXAMiddlewareContext = MiddlewareContext;

export type FSXAModuleOptions = _FSXAModuleOptions;

/**
 * Client-specific access control configurations.
 *
 * @experimental
 */
export type ClientAccessControlConfig<ClientContexType> = {
  clientContextProvider: ClientAccessControlContextProvider<ClientContexType>;
};
export type ClientAccessControlContextProvider<ContextType> = (
  contextProviderParams: ClientContextProviderParams,
) => ContextType;
export interface ClientContextProviderParams {
  store: Store<any>;
}

/**
 * Server-specific access control configurations.
 *
 * @experimental
 */
export type ServerAccessControlConfig<ClientContextType> =
  RemoteApiFilterOptions<ClientContextType>;
