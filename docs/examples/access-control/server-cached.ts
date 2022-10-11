import {
  NavigationItem,
  CaasItem,
  Permission,
  DataEntry,
  NavigationItemFilterParams,
  CaasItemFilterParams,
} from "fsxa-api";
import { ServerAccessControlConfig } from "fsxa-nuxt-module";
import { UserAuthClientContext } from "./common";
import NodeCache from "node-cache";

async function filterNavigationItems({
  navigationItems,
  filterContext: userAuthContext,
}: NavigationItemFilterParams<UserAuthClientContext>): Promise<
  NavigationItem[]
> {
  const userGroups = retrieveUserGroups(userAuthContext?.token);
  return navigationItems.filter((item: NavigationItem) => {
    const allowedGroups = item.permissions?.allowed || [];
    return isAllowed(userGroups, allowedGroups);
  });
}

async function filterCaasItems({
  mappedItems,
  referenceMap,
  resolvedReferences,
  filterContext: userAuthContext,
}: CaasItemFilterParams<UserAuthClientContext>): Promise<MapResponse> {
  const userGroups = retrieveUserGroups(userAuthContext?.token);
  return {
    mappedItems: mappedItems.filter((item: CaasItem) => {
      switch (item.type) {
        case "Dataset":
          const datasetPermission = item.data.tt_permissions as DataEntry;
          if (datasetPermission && isPermission(datasetPermission)) {
            const firstPermission = datasetPermission.value[0];
            const allowedGroups = firstPermission.allowed.map(
              (group) => group.groupId,
            );
            return isAllowed(userGroups, allowedGroups);
          }
          return false;
        default:
          return true;
      }
    }),
    referenceMap,
    resolvedReferences,
  };
}

function isAllowed(userGroups: string[], allowedGroups: string[]): boolean {
  return userGroups.some((group) => allowedGroups.includes(group));
}

const cache = new NodeCache({ stdTTL: 30, checkperiod: 30 });
function retrieveUserGroups(userAuthToken?: string): string[] {
  if (userAuthToken) {
    let groups = cache.get<string[]>(userAuthToken);
    if (groups) {
      return groups;
    }
    // Hardcoding anonymous group for all users.
    // Replace with your dynamic logic to compute or fetch auth data about the user.
    groups = ["anonymous"];

    cache.set(userAuthToken, groups);
    return groups;
  } else return ["anonymous"];
}

function isPermission(dataEntry: DataEntry): dataEntry is Permission {
  return dataEntry.type === "Permission";
}

export default {
  navigationItemFilter: filterNavigationItems,
  caasItemFilter: filterCaasItems,
} as ServerAccessControlConfig<UserAuthClientContext>;
