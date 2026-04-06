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
    .login-container { 
      height: 100vh; 
      width: 100vw; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: radial-gradient(circle at 20% 30%, #1e293b 0%, #0b0f19 100%);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    .login-card { 
      width: 90%; 
      max-width: 420px; 
      padding: 3rem; 
      border-radius: 30px; 
      background: rgba(30, 41, 59, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05); 
      text-align: center; 
      box-shadow: 0 50px 100px rgba(0,0,0,0.8);
      animation: fadeInScale 0.6s ease-out;
    }
    .login-header { margin-bottom: 2.5rem; }
    .logo { width: 90px; margin-bottom: 1.5rem; filter: drop-shadow(0 0 25px rgba(203, 178, 106, 0.4)); }
    .login-header h1 { font-size: 2.2rem; margin: 0; color: #cbb26a; font-weight: 900; letter-spacing: -1.5px; }
    .login-header p { color: #94a3b8; font-size: 0.95rem; margin-top: 0.8rem; }
    
    .form-group { text-align: left; margin-bottom: 1.8rem; }
    .form-group label { display: block; margin-bottom: 0.6rem; color: #64748b; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    
    .input-container { position: relative; }
    .input-container i { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #cbb26a; font-size: 1.1rem; opacity: 0.6; }
    .input-container input { width: 100%; padding: 16px 16px 16px 50px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.03); border-radius: 15px; color: white; outline: none; transition: 0.3s; font-size: 1rem; }
    .input-container input:focus { border-color: #cbb26a; background: rgba(0,0,0,0.4); box-shadow: 0 0 20px rgba(203, 178, 106, 0.1); }
    
    .btn-login { width: 100%; padding: 18px; background: linear-gradient(135deg, #cbb26a 0%, #b69c5e 100%); color: #0f172a; border: none; border-radius: 15px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-top: 1.5rem; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 20px rgba(203, 178, 106, 0.15); }
    .btn-login:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 15px 30px rgba(203, 178, 106, 0.25); }
    .btn-login:disabled { opacity: 0.4; cursor: not-allowed; }
    
    .error-message { margin-top: 1.5rem; padding: 14px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; color: #ef4444; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid rgba(239, 68, 68, 0.2); }
    .login-footer { margin-top: 3rem; color: #475569; font-size: 0.75rem; letter-spacing: 1px; }

    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .spinner { width: 22px; height: 22px; border: 3px solid rgba(15, 23, 42, 0.3); border-top-color: #0f172a; border-radius: 50%; animation: spin 1s linear infinite; }
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
