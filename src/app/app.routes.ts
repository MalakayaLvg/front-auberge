import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {RoomsComponent} from './rooms/rooms.component';

const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isLoggedIn();
};

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'rooms',
    component: RoomsComponent,
  }
];
