import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './models/user.model';
import { AuthResponse } from './models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'https://back-auberge.malakayalauvergnat.com';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = this.parseJwt(token);
        if (payload && !this.isTokenExpired(payload)) {
          const user: User = {
            id: payload.sub || payload.id,
            username: payload.username,
            password: '',
          };
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token", error);
        this.logout();
      }
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return null;
    }
  }

  private isTokenExpired(payload: any): boolean {
    if (!payload.exp) return false;
    const expiry = new Date(payload.exp * 1000);
    return expiry < new Date();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/login_check`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          this.currentUserSubject.next(response.user);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Erreur de connexion', error);
          return throwError(() => new Error('Identifiants invalides'));
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.currentUserSubject.next(response.user);
          }
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Erreur d\'inscription', error);
          return throwError(() => new Error('Inscription échouée'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }
}
