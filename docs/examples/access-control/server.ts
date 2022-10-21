import {
  NavigationItem,
  CaasItem,
  Permission,
  DataEntry,
  NavigationItemFilterParams,
  CaasItemFilterParams,
} from "fsxa-api";
import { MapResponse } from "fsxa-api/dist/types/modules";
import { ServerAccessControlConfig } from "fsxa-nuxt-module";
import { UserAuthClientContext } from "./common";

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
  const filteredMappedItems = mappedItems.filter((item) => {
    if (item.type === "Image") {
      const permissions = item.meta.md_permissions;
      if (permissions) {
        const firstPermission = permissions.value[0];
        const allowedGroups = firstPermission.allowed.map(
          (group) => group.groupId,
        );
        return isAllowed(userGroups, allowedGroups);
      } else return false;
    } else return true;
  });

  const filteredResolvedReferences = Object.fromEntries(
    Object.entries(resolvedReferences).filter(([key, item]) => {
      if (item.type === "Image") {
        const permissions = item.meta.md_permissions;
        if (permissions) {
          const firstPermission = permissions.value[0];
          const allowedGroups = firstPermission.allowed.map(
            (group) => group.groupId,
          );
          return isAllowed(userGroups, allowedGroups);
        } else return false;
      } else return true;
    }),
  );

  return {
    mappedItems: filteredMappedItems,
    referenceMap,
    resolvedReferences: filteredResolvedReferences,
  };
}

function isAllowed(userGroups: string[], allowedGroups: string[]): boolean {
  return userGroups.some((group) => allowedGroups.includes(group));
}

function retrieveUserGroups(userAuthToken?: string): string[] {
  // Hardcoding anonymous group for all users.
  // Replace with your dynamic logic to compute or fetch auth data about the user.
  return ["anonymous"];
}

function isPermission(dataEntry: DataEntry): dataEntry is Permission {
  return dataEntry.type === "Permission";
}

export default {
  navigationItemFilter: filterNavigationItems,
  caasItemFilter: filterCaasItems,
} as ServerAccessControlConfig<UserAuthClientContext>;
