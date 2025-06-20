import { mainNavItems, hotelManagementItems } from "@/config/sidebar-config";
import type { Permission } from "@/lib/permissions";

function flatten(items: any[]): { label: string; permission: Permission }[] {
  return items.flatMap(item =>
    item.children
      ? [
          { label: item.label, permission: item.permission },
          ...flatten(item.children)
        ]
      : [{ label: item.label, permission: item.permission }]
  );
}

function uniqueByPermission(arr: { label: string; permission: Permission }[]) {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item.permission)) return false;
    seen.add(item.permission);
    return true;
  });
}

export const dashboardPermissions = uniqueByPermission(flatten(mainNavItems));
export const hotelManagementPermissions = uniqueByPermission(flatten(hotelManagementItems));
