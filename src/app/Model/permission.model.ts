export interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  module: string;
}

export interface UserPermission {
  userId: number;
  permissionId: number;
  granted: boolean;
  grantedBy: number;
  grantedAt: Date;
}

export interface RolePermission {
  role: 'user' | 'admin';
  permissions: Permission[];
}