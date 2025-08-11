export interface IAccessControlEntity {
  getAclRoles(): string[] | null;
  setAclRoles(roles: string[]): void;
  getAclGroups(): string[] | null;
  setAclGroups(groups: string[]): void;
}

export interface IAclConfig {
  defaultGroup: string;
  groups: IAclGroup[];
  roles: IAclRole[];
}

export interface IAclGroup {
  name: string;
  roles: string[];
}

export interface IAclRole {
  name: string;
  scopes: string[];
}

export interface IBasicACLService {
  getConfig(): IAclConfig;
  getDefaultGroup(): IAclGroup;
  getGroup(group: string | IAclGroup): IAclGroup;
  getGroupRoles(group: string | IAclGroup): IAclRole[];
  getGroupScopes(group: string | IAclGroup): string[];
  getRoleScopesFromUser(data: IAccessControlEntity): string[];
  getRoleScopes(role: string | string[]): string[];
  getRole(role: string): IAclRole;
  assignRoleToUser(
    data: IAccessControlEntity,
    role: string | string[],
  ): Promise<void>;
  assignGroupToUser(
    data: IAccessControlEntity,
    group: string | string[],
  ): Promise<void>;
  removeRoleFromUser(
    usdataer: IAccessControlEntity,
    role: string | string[],
  ): Promise<void>;
  removeGroupFromUser(
    data: IAccessControlEntity,
    group: string | string[],
  ): Promise<void>;
}
