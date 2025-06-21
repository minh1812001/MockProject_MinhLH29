import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../Model/user.model';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { PermissionService } from '../../services/permission-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list-component',
  standalone: true,

  imports: [CommonModule, FormsModule],
  templateUrl: './user-list-component.html',
  styleUrl: './user-list-component.css',
})
export class UserListComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  sortField: keyof User = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  currentUser: User | null = null;
  selectedUsers: number[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || !this.canViewUsers()) {
      this.router.navigate(['/profile']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.users$.subscribe({
      next: (users) => {
        this.users = users;
        this.filterAndSortUsers();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      },
    });
  }

  filterAndSortUsers(): void {
    let filtered = [...this.users];

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term)
      );
    }

    // Sort users
    filtered.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      if (aValue === undefined || bValue === undefined) return 0;

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      else if (aValue < bValue) comparison = -1;

      return this.sortDirection === 'desc' ? -comparison : comparison;
    });

    this.filteredUsers = filtered;
  }

  onSearchChange(): void {
    this.filterAndSortUsers();
  }

  onSort(field: keyof User): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterAndSortUsers();
  }

  getSortIcon(field: keyof User): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
  }

  selectAllUsers(): void {
    if (this.selectedUsers.length === this.filteredUsers.length) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = this.filteredUsers.map((user) => user.id);
    }
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId);
  }

  editUser(user: User): void {
    // For now, navigate to edit profile (you can create a dedicated edit user component)
    this.router.navigate(['/edit-profile'], {
      queryParams: { userId: user.id },
    });
  }

  deleteUser(user: User): void {
    if (user.id === this.currentUser?.id) {
      this.errorMessage = 'Cannot delete your own account';
      return;
    }

    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: (success) => {
          if (success) {
            this.successMessage = `User "${user.username}" deleted successfully`;
            setTimeout(() => (this.successMessage = ''), 3000);
          } else {
            this.errorMessage = 'Failed to delete user';
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user';
        },
      });
    }
  }

  deleteSelectedUsers(): void {
    if (this.selectedUsers.length === 0) return;

    // Check if current user is in selection
    if (this.selectedUsers.includes(this.currentUser?.id || 0)) {
      this.errorMessage = 'Cannot delete your own account';
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${this.selectedUsers.length} selected users?`
      )
    ) {
      let deletedCount = 0;
      const totalCount = this.selectedUsers.length;

      this.selectedUsers.forEach((userId) => {
        this.userService.deleteUser(userId).subscribe({
          next: (success) => {
            if (success) {
              deletedCount++;
              if (deletedCount === totalCount) {
                this.successMessage = `${deletedCount} users deleted successfully`;
                this.selectedUsers = [];
                setTimeout(() => (this.successMessage = ''), 3000);
              }
            }
          },
          error: (error) => {
            this.errorMessage = 'Some users could not be deleted';
          },
        });
      });
    }
  }

  toggleUserStatus(user: User): void {
    const updatedUser = { ...user, isActive: !user.isActive };
    this.userService.updateUser(user.id, updatedUser).subscribe({
      next: (updated) => {
        this.successMessage = `User status updated successfully`;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update user status';
      },
    });
  }

  canViewUsers(): boolean {
    return this.currentUser
      ? this.permissionService.canViewUsers(this.currentUser.role)
      : false;
  }

  canEditUsers(): boolean {
    return this.currentUser
      ? this.permissionService.canEditUsers(this.currentUser.role)
      : false;
  }

  canDeleteUsers(): boolean {
    return this.currentUser
      ? this.permissionService.canDeleteUsers(this.currentUser.role)
      : false;
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
