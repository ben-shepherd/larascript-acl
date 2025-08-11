import {
  IAccessControlEntity,
  IAclConfig,
  IAclGroup,
  IAclRole,
  IBasicACLService,
} from ".";

/**
 * Access Control List (ACL) Service
 *
 * This service manages role-based access control (RBAC) by:
 * - Managing user groups and their associated roles
 * - Managing roles and their associated permissions/scopes
 * - Providing methods to retrieve and validate permissions
 *
 * The service works with a configuration object that defines:
 * - Groups (e.g. 'Admin', 'User')
 * - Roles (e.g. 'role_admin', 'role_user')
 * - Scopes/permissions for each role
 */
export class BasicACLService implements IBasicACLService {
  private aclConfig: IAclConfig;

  constructor(aclConfig: IAclConfig) {
    this.aclConfig = aclConfig;
  }

  /**
   * Get the ACL config
   * @returns
   */
  getConfig(): IAclConfig {
    return this.aclConfig;
  }

  /**
   * Retrieves the scopes from the roles
   * @param data
   * @returns
   */
  getRoleScopesFromUser(data: IAccessControlEntity): string[] {
    const roles = data.getAclRoles();

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

  /**
   * Retrieves the role from the config
   * @param role
   * @returns
   */
  getRole(role: string): IAclRole {
    const result = this.aclConfig.roles.find((r) => r.name === role);

    if (!result) {
      throw new Error(`Role ${role} not found`);
    }

    return result;
  }

  /**
   * Retrieves the scopes from the roles
   * @param role
   * @returns
   */
  getRoleScopes(role: string | string[]): string[] {
    const rolesArray = typeof role === "string" ? [role] : role;
    let scopes: string[] = [];

    for (const roleStr of rolesArray) {
      const role = this.getRole(roleStr);
      scopes = [...scopes, ...role.scopes];
    }

    return scopes;
  }

  /**
   * Assigns a role to a user
   * @param data
   * @param role
   */
  async assignRoleToUser(
    data: IAccessControlEntity,
    role: string | string[],
  ): Promise<void> {
    const rolesArray = typeof role === "string" ? [role] : role;
    data.setAclRoles(rolesArray);
  }

  /**
   * Appends a role to a user
   * @param user
   * @param role
   */
  async appendRoleToUser(
    data: IAccessControlEntity,
    role: string,
  ): Promise<void> {
    const currentRoles = data.getAclRoles() ?? [];
    const newRoles = [...currentRoles, role];

    data.setAclRoles(newRoles);
  }

  /**
   * Removes a role from a user
   * @param user
   * @param role
   */
  async removeRoleFromUser(
    data: IAccessControlEntity,
    role: string | string[],
  ): Promise<void> {
    const rolesArray = typeof role === "string" ? [role] : role;
    const currentRoles = data.getAclRoles() ?? [];
    const newRoles = currentRoles.filter(
      (r) => false === rolesArray.includes(r),
    );

    data.setAclRoles(newRoles);
  }

  /**
   * Get the default group
   * @returns
   */
  getDefaultGroup(): IAclGroup {
    return this.getGroup(this.aclConfig.defaultGroup);
  }

  /**
   * Get the group
   * @param group
   * @returns
   */
  getGroup(group: string): IAclGroup {
    const result = this.aclConfig.groups.find((g) => g.name === group);

    if (!result) {
      throw new Error(`Group ${group} not found`);
    }

    return result;
  }

  /**
   * Get the roles from the group
   * @param group
   * @returns
   */
  getGroupRoles(group: string | IAclGroup): IAclRole[] {
    const groupResult =
      typeof group === "string" ? this.getGroup(group) : group;
    return groupResult.roles.map((role) => this.getRole(role));
  }

  /**
   * Get the scopes from the group
   * @param group
   * @returns
   */
  getGroupScopes(group: string | IAclGroup): string[] {
    const roles = this.getGroupRoles(group);
    return roles.map((role) => role.scopes).flat();
  }

  /**
   * Assigns a group to a user
   * @param user
   * @param group
   */
  async assignGroupToUser(
    data: IAccessControlEntity,
    group: string | string[],
  ): Promise<void> {
    const groupsArray = typeof group === "string" ? [group] : group;

    data.setAclGroups(groupsArray);
  }

  /**
   * Appends a group to a user
   * @param data
   * @param group
   */
  async appendGroupToUser(
    data: IAccessControlEntity,
    group: string,
  ): Promise<void> {
    const currentGroups = data.getAclGroups() ?? [];
    const newGroups = [...currentGroups, group];

    data.setAclGroups(newGroups);
  }

  /**
   * Removes a group from a user
   * @param user
   * @param group
   */
  async removeGroupFromUser(
    data: IAccessControlEntity,
    group: string | string[],
  ): Promise<void> {
    const groupsArray = typeof group === "string" ? [group] : group;
    const currentGroups = data.getAclGroups() ?? [];
    const newGroups = currentGroups.filter(
      (g) => false === groupsArray.includes(g),
    );

    data.setAclGroups(newGroups);
  }
}

export default BasicACLService;
