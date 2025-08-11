import { TClassConstructor } from "../utils/compose";
import { BasicACLException } from "./BasicACLException";
import {
  IAccessControlEntity,
  IAclConfig,
  IAclGroup,
  IAclRole,
} from "./IACLService";

/**
 * Composable ACL Mixin
 *
 * This mixin provides access control functionality that can be composed
 * into other classes using the compose utility.
 *
 * Usage:
 * ```typescript
 * class User extends compose(BaseUser, ComposableACL(aclConfig)) {
 *   // User now has all ACL functionality
 * }
 * ```
 */
export const ComposableACL = <T extends TClassConstructor>(
  aclConfig: IAclConfig,
) => {
  return (BaseClass: T) => {
    return class extends BaseClass implements IAccessControlEntity {
      _aclRoles: string[] = [];
      _aclGroups: string[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        super(...args);
      }

      // IAccessControlEntity implementation
      getAclRoles(): string[] | null {
        return this._aclRoles.length > 0 ? this._aclRoles : null;
      }

      setAclRoles(roles: string[]): void {
        this._aclRoles = roles;
      }

      getAclGroups(): string[] | null {
        return this._aclGroups.length > 0 ? this._aclGroups : null;
      }

      setAclGroups(groups: string[]): void {
        this._aclGroups = groups;
      }

      // ACL Service methods
      getConfig(): IAclConfig {
        return aclConfig;
      }

      getDefaultGroup(): IAclGroup {
        return this.getGroup(aclConfig.defaultGroup);
      }

      getGroup(group: string): IAclGroup {
        const result = aclConfig.groups.find((g) => g.name === group);

        if (!result) {
          throw new BasicACLException(`Group ${group} not found`);
        }

        return result;
      }

      getRole(role: string): IAclRole {
        const result = aclConfig.roles.find((r) => r.name === role);

        if (!result) {
          throw new BasicACLException(`Role ${role} not found`);
        }

        return result;
      }

      hasScope(scope: string): boolean {
        const roles = this.getAclRoles() ?? [];

        for (const roleName of roles) {
          const role = this.getRole(roleName);
          if (role.scopes.includes(scope)) return true;
        }

        return false;
      }

      hasScopes(scopes: string[]): boolean {
        for (const scope of scopes) {
          if (!this.hasScope(scope)) return false;
        }

        return true;
      }

      hasRole(role: string | string[]): boolean {
        const rolesArray = typeof role === "string" ? [role] : role;
        const userRoles = this.getAclRoles() ?? [];

        for (const requiredRole of rolesArray) {
          if (!userRoles.includes(requiredRole)) return false;
        }

        return true;
      }

      hasGroup(groups: string | string[]): boolean {
        groups = typeof groups === "string" ? [groups] : groups;
        const foundGroups = this.getAclGroups() ?? [];

        for (const group of groups) {
          if (!foundGroups.includes(group)) return false;
        }

        return true;
      }

      getRoleScopesFromUser(): string[] {
        const roles = this.getAclRoles();

        if (!roles) {
          return [];
        }

        let scopes: string[] = [];

        for (const roleString of roles) {
          const role = this.getRole(roleString);
          scopes = [...scopes, ...role.scopes];
        }

        return scopes;
      }

      getRoleScopes(role: string | string[]): string[] {
        const rolesArray = typeof role === "string" ? [role] : role;
        let scopes: string[] = [];

        for (const roleStr of rolesArray) {
          const role = this.getRole(roleStr);
          scopes = [...scopes, ...role.scopes];
        }

        return scopes;
      }

      getGroupRoles(group: string | IAclGroup): IAclRole[] {
        const groupResult =
          typeof group === "string" ? this.getGroup(group) : group;
        return groupResult.roles.map((role) => this.getRole(role));
      }

      getGroupScopes(group: string | IAclGroup): string[] {
        const roles = this.getGroupRoles(group);
        return roles.map((role) => role.scopes).flat();
      }

      async assignRoleToUser(role: string | string[]): Promise<void> {
        const rolesArray = typeof role === "string" ? [role] : role;
        this.setAclRoles(rolesArray);
      }

      async appendRoleToUser(role: string): Promise<void> {
        const currentRoles = this.getAclRoles() ?? [];
        const newRoles = [...currentRoles, role];

        this.setAclRoles(newRoles);
      }

      async removeRoleFromUser(role: string | string[]): Promise<void> {
        const rolesArray = typeof role === "string" ? [role] : role;
        const currentRoles = this.getAclRoles() ?? [];
        const newRoles = currentRoles.filter(
          (r) => false === rolesArray.includes(r),
        );

        this.setAclRoles(newRoles);
      }

      async assignGroupToUser(group: string | string[]): Promise<void> {
        const groupsArray = typeof group === "string" ? [group] : group;
        this.setAclGroups(groupsArray);
      }

      async appendGroupToUser(group: string): Promise<void> {
        const currentGroups = this.getAclGroups() ?? [];
        const newGroups = [...currentGroups, group];

        this.setAclGroups(newGroups);
      }

      async removeGroupFromUser(group: string | string[]): Promise<void> {
        const groupsArray = typeof group === "string" ? [group] : group;
        const currentGroups = this.getAclGroups() ?? [];
        const newGroups = currentGroups.filter(
          (g) => false === groupsArray.includes(g),
        );

        this.setAclGroups(newGroups);
      }
    };
  };
};
