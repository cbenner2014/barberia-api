import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  template: `
    <div class="admin-container">
      <app-sidebar class="sidebar-wrapper"></app-sidebar>
      <main class="main-content">
        <div class="content-view page-transition">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: `
    .admin-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      background: #0f172a;
      overflow: hidden;
    }

    .sidebar-wrapper {
      width: 280px;
      flex-shrink: 0;
      z-index: 10;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      position: relative;
      padding: 1.5rem;
      background: radial-gradient(circle at 50% -20%, #1e293b 0%, #0f172a 100%);
    }


    .content-view {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    /* Animación suave entre páginas */
    .page-transition {
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
})
export class AdminLayoutComponent {}
