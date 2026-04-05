import { type PermissionResolvable, PermissionsBitField, type PermissionsString } from "discord.js";

/**
 * @param {string | number | bigint} permissions
 * @param {import('discord.js').PermissionsString} permission
 */
export function hasPermissions(permissions: PermissionResolvable, permission: PermissionsString): boolean {
    const perms = new PermissionsBitField(permissions);
    return perms.has(permission);
}