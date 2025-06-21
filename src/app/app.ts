import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { RegisterComponent } from './components/register-component/register-component';
import { ProfileComponent } from './components/profile-component/profile-component';
import { EditProfileComponent } from './components/edit-profile-component/edit-profile-component';
import { UserListComponent } from './components/user-list-component/user-list-component';
import { AdminDashboardComponent } from './components/admin-dashboard-component/admin-dashboard-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, BrowserModule, LoginComponent, RegisterComponent, ProfileComponent, EditProfileComponent, UserListComponent, AdminDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MockProject_MinhLH29';
}
