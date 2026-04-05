import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card glass">
        <div class="login-header">
          <img src="https://img.icons8.com/isometric/512/barbershop.png" alt="Logo" class="logo">
          <h1>Barbería Pro</h1>
          <p>Potenciando tu estilo con elegancia</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Usuario</label>
            <div class="input-container">
              <i class="fas fa-user"></i>
              <input type="text" formControlName="username" placeholder="Ingresa tu usuario">
            </div>
          </div>

          <div class="form-group">
            <label>Contraseña</label>
            <div class="input-container">
              <i class="fas fa-lock"></i>
              <input type="password" formControlName="password" placeholder="••••••••">
            </div>
          </div>

          <button type="submit" class="btn-login" [disabled]="loginForm.invalid || loading()">
            <span *ngIf="!loading()">Iniciar Sesión</span>
            <span *ngIf="loading()" class="spinner"></span>
          </button>

          <div *ngIf="errorMessage()" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ errorMessage() }}
          </div>
        </form>

        <div class="login-footer">
          <p>© 2026 Barbería Pro System</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .login-container { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 10% 20%, rgb(18, 18, 18) 0%, rgb(25, 25, 25) 90%); }
    .login-card { width: 100%; max-width: 400px; padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); text-align: center; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
    .login-header { margin-bottom: 2.5rem; }
    .logo { width: 80px; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(255, 183, 3, 0.3)); }
    .login-header h1 { font-size: 2rem; margin: 0; color: #ffb703; font-weight: 800; letter-spacing: -1px; }
    .login-header p { color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; margin-top: 0.5rem; }
    
    .form-group { text-align: left; margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.85rem; font-weight: 500; }
    
    .input-container { position: relative; }
    .input-container i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); }
    .input-container input { width: 100%; padding: 14px 14px 14px 45px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none; transition: 0.3s; }
    .input-container input:focus { border-color: #ffb703; background: rgba(255,255,255,0.08); box-shadow: 0 0 15px rgba(255, 183, 3, 0.1); }
    
    .btn-login { width: 100%; padding: 14px; background: linear-gradient(135deg, #ffb703 0%, #fb8500 100%); color: #121212; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.3s; margin-top: 1rem; display: flex; justify-content: center; align-items: center; }
    .btn-login:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(251, 133, 0, 0.3); brightness: 1.1; }
    .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .error-message { margin-top: 1.5rem; padding: 12px; background: rgba(255, 77, 77, 0.1); border-radius: 8px; color: #ff4d4d; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid rgba(255, 77, 77, 0.2); }
    .login-footer { margin-top: 2.5rem; color: rgba(255,255,255,0.3); font-size: 0.8rem; }

    .spinner { width: 20px; height: 20px; border: 3px solid rgba(18,18,18,0.3); border-top-color: #121212; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.loading.set(false);
          this.errorMessage.set('Credenciales inválidas o error de conexión');
          console.error(err);
        }
      });
    }
  }
}
