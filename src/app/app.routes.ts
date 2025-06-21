import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { ProfileComponent } from './components/profile-component/profile-component';
import { EditProfileComponent } from './components/edit-profile-component/edit-profile-component';
import { AdminDashboardComponent } from './components/admin-dashboard-component/admin-dashboard-component';

export const routes: Routes = [
  // Route này yêu cầu người dùng phải đăng nhập và có vai trò là 'admin'
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' },
  },
  // Route này chỉ yêu cầu người dùng phải đăng nhập
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  // Route này yêu cầu người dùng phải đăng nhập và có quyền 'edit-article'
  {
    path: 'article/edit/:id',
    component: EditProfileComponent,
    canActivate: [AuthGuard],
    data: { permission: 'edit-article' },
  },
];
