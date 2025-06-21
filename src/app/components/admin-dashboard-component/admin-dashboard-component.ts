import { Component } from '@angular/core';
import { User } from '../../Model/user.model';
import { CommonModule } from '@angular/common';
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: User[];
}
@Component({
  selector: 'app-admin-dashboard-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-component.html',
  styleUrl: './admin-dashboard-component.css',
})
export class AdminDashboardComponent {
  currentUser: User | null = null;
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentUsers: [],
  };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser || !this.canAccessAdminDashboard()) {
      this.router.navigate(['/profile']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.userService.users$.subscribe({
      next: (users) => {
        this.calculateStats(users);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      },
    });
  }

  calculateStats(users: User[]): void {
    this.stats.totalUsers = users.length;
    this.stats.activeUsers = users.filter((u) => u.isActive).length;
    this.stats.inactiveUsers = users.filter((u) => !u.isActive).length;
    this.stats.adminUsers = users.filter((u) => u.role === 'admin').length;
    this.stats.regularUsers = users.filter((u) => u.role === 'user').length;

    // Get 5 most recent users
    this.stats.recentUsers = users
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }

  canAccessAdminDashboard(): boolean {
    return this.currentUser
      ? this.permissionService.canAccessAdminDashboard(this.currentUser.role)
      : false;
  }

  navigateToUserList(): void {
    this.router.navigate(['/user-list']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getActiveUserPercentage(): number {
    if (this.stats.totalUsers === 0) return 0;
    return Math.round((this.stats.activeUsers / this.stats.totalUsers) * 100);
  }

  getAdminUserPercentage(): number {
    if (this.stats.totalUsers === 0) return 0;
    return Math.round((this.stats.adminUsers / this.stats.totalUsers) * 100);
  }
}
