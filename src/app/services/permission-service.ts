import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Permission, RolePermission } from '../Model/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: Permission[] = [
    { id: 1, name: 'View Users', code: 'VIEW_USERS', description: 'Can view user list', module: 'User Management' },
    { id: 2, name: 'Create Users', code: 'CREATE_USERS', description: 'Can create new users', module: 'User Management' },
    { id: 3, name: 'Edit Users', code: 'EDIT_USERS', description: 'Can edit user information', module: 'User Management' },
    { id: 4, name: 'Delete Users', code: 'DELETE_USERS', description: 'Can delete users', module: 'User Management' },
    { id: 5, name: 'View Profile', code: 'VIEW_PROFILE', description: 'Can view own profile', module: 'Profile' },
    { id: 6, name: 'Edit Profile', code: 'EDIT_PROFILE', description: 'Can edit own profile', module: 'Profile' },
    { id: 7, name: 'Admin Dashboard', code: 'ADMIN_DASHBOARD', description: 'Can access admin dashboard', module: 'Dashboard' },
    { id: 8, name: 'Manage Permissions', code: 'MANAGE_PERMISSIONS', description: 'Can manage user permissions', module: 'Permissions' }
  ];

  private rolePermissions: RolePermission[] = [
    {
      role: 'admin',
      permissions: this.permissions // Admin has all permissions
    },
    {
      role: 'user',
      permissions: [
        this.permissions[4], // VIEW_PROFILE
        this.permissions[5]  // EDIT_PROFILE
      ]
    }
  ];

  getAllPermissions(): Observable<Permission[]> {
    return of(this.permissions);
  }

  getPermissionsByRole(role: 'user' | 'admin'): Observable<Permission[]> {
    const rolePermission = this.rolePermissions.find(rp => rp.role === role);
    return of(rolePermission?.permissions || []);
  }

  hasPermission(userRole: 'user' | 'admin', permissionCode: string): boolean {
    const rolePermission = this.rolePermissions.find(rp => rp.role === userRole);
    return rolePermission?.permissions.some(p => p.code === permissionCode) || false;
  }

  canViewUsers(userRole: 'user' | 'admin'): boolean {
    return this.hasPermission(userRole, 'VIEW_USERS');
  }

  canEditUsers(userRole: 'user' | 'admin'): boolean {
    return this.hasPermission(userRole, 'EDIT_USERS');
  }

  canDeleteUsers(userRole: 'user' | 'admin'): boolean {
    return this.hasPermission(userRole, 'DELETE_USERS');
  }

  canAccessAdminDashboard(userRole: 'user' | 'admin'): boolean {
    return this.hasPermission(userRole, 'ADMIN_DASHBOARD');
  }
}
