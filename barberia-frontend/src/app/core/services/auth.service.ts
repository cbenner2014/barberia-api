import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse, Rol } from '../models/barberia.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://motivated-courage-production-877a.up.railway.app/api/auth';
  
  // Signal to store current user info
  public currentUser = signal<LoginResponse | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveUser(response);
        this.currentUser.set(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('barberia_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private saveUser(user: LoginResponse): void {
    localStorage.setItem('barberia_user', JSON.stringify(user));
  }

  private getUserFromStorage(): LoginResponse | null {
    const user = localStorage.getItem('barberia_user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  hasRole(rol: Rol): boolean {
    return this.currentUser()?.rol === rol;
  }

  getToken(): string | null {
    return this.currentUser()?.token || null;
  }
}
