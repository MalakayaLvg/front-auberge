import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
        <button (click)="logout()" class="btn-logout">Déconnexion</button>
      </div>
      <div class="dashboard-content">
        <p>Bienvenue, {{ userName }}!</p>
        <p>Vous êtes connecté avec succès.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .btn-logout {
      padding: 8px 16px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-logout:hover {
      background-color: #c82333;
    }
  `]
})
export class DashboardComponent {
  userName: string = 'utilisateur';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {

    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
