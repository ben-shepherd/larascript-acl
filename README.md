# Larascript ACL Bundle

A lightweight Access Control List (ACL) service for the Larascript Framework that provides role-based access control (RBAC) functionality.

## Features

- **Role Management**: Define roles with specific permissions/scopes
- **Group Management**: Organize roles into groups for easier administration
- **User Assignment**: Assign roles and groups to users
- **Permission Validation**: Check user permissions based on their roles
- **TypeScript Support**: Full type safety with TypeScript interfaces

## Installation

```bash
npm install ben-shepherd/larascript-acl-bundle
```

## Quick Start

```typescript
import { BasicACLService, IAclConfig } from '@ben-shepherd/larascript-acl-bundle';

// Define your ACL configuration
const aclConfig: IAclConfig = {
  defaultGroup: 'user',
  groups: [
    {
      name: 'admin',
      roles: ['role_admin']
    },
    {
      name: 'user', 
      roles: ['role_user']
    }
  ],
  roles: [
    {
      name: 'role_admin',
      scopes: ['read:all', 'write:all', 'delete:all']
    },
    {
      name: 'role_user',
      scopes: ['read:own', 'write:own']
    }
  ]
};

// Initialize the service
const aclService = new BasicACLService(aclConfig);

// Use with your user entity
const user = {
  getAclRoles: () => ['role_user'],
  setAclRoles: (roles: string[]) => { /* implementation */ },
  getAclGroups: () => ['user'],
  setAclGroups: (groups: string[]) => { /* implementation */ }
};

// Get user permissions
const scopes = aclService.getRoleScopesFromUser(user);
// Returns: ['read:own', 'write:own']
```

## API

### Core Methods

- `getRoleScopesFromUser(user)` - Get all scopes for a user's roles
- `assignRoleToUser(user, role)` - Assign role(s) to user
- `removeRoleFromUser(user, role)` - Remove role(s) from user
- `getGroupRoles(group)` - Get all roles in a group
- `getGroupScopes(group)` - Get all scopes in a group

### Configuration

The service requires an `IAclConfig` object with:
- **Groups**: Collections of roles (e.g., 'admin', 'user')
- **Roles**: Named permissions with scopes (e.g., 'role_admin', 'role_user')
- **Scopes**: Individual permissions (e.g., 'read:all', 'write:own')

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint and format
npm run lint:fix
npm run format
```

## License

ISC