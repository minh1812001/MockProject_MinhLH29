import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../Model/user.model';
import { Permission } from '../../Model/permission.model';
import { AuthService } from '../../services/auth-service';
import { PermissionService } from '../../services/permission-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css',
})
export class ProfileComponent {
  currentUser: User | null = null;
  userPermissions: Permission[] = [];

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadUserPermissions();
    }
  }

  loadUserPermissions(): void {
    if (this.currentUser) {
      this.permissionService
        .getPermissionsByRole(this.currentUser.role)
        .subscribe({
          next: (permissions) => {
            this.userPermissions = permissions;
          },
        });
    }
  }

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToUserList(): void {
    this.router.navigate(['/user-list']);
  }

  goToAdminDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  canViewUsers(): boolean {
    return this.currentUser
      ? this.permissionService.canViewUsers(this.currentUser.role)
      : false;
  }

  canAccessAdminDashboard(): boolean {
    return this.currentUser
      ? this.permissionService.canAccessAdminDashboard(this.currentUser.role)
      : false;
  }
}
