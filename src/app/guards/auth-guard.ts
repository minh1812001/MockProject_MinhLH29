import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { PermissionService } from '../services/permission-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    const currentUser = this.authService.getCurrentUser();

    if (requiredRole && currentUser?.role !== requiredRole) {
      this.router.navigate(['/profile']);
      return false;
    }

    const requiredPermission = route.data['permission'];
    if (requiredPermission && currentUser) {
      if (!this.permissionService.hasPermission(currentUser.role, requiredPermission)) {
        this.router.navigate(['/profile']);
        return false;
      }
    }

    return true;
  }
}
