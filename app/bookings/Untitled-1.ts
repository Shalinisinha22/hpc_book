// utils/get-all-permissions.ts
import { mainNavItems, hotelManagementItems, otherItems } from "@/config/sidebar-config";
import type { Permission } from "@/lib/permissions";

export function getAllSidebarPermissions(): Permission[] {
  const flatten = (items: any[]): Permission[] =>
    items.flatMap(item =>
      item.children ? [item.permission, ...flatten(item.children)] : [item.permission]
    );
  return Array.from(new Set([
    ...flatten(mainNavItems),
    ...flatten(hotelManagementItems),
    ...flatten(otherItems),
  ]));
}