import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberiaService } from '../../core/services/barberia.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Panel de Control</h1>
      <p>Bienvenido al sistema de gestión de la Barbería.</p>
      
      <div class="stats-grid">
        <div class="stat-card glass">
          <i class="fas fa-calendar-alt"></i>
          <div>
            <h3>Citas Registradas</h3>
            <span class="value">{{ totalCitas() }}</span>
          </div>
        </div>
        <div class="stat-card glass">
          <i class="fas fa-users"></i>
          <div>
            <h3>Clientes</h3>
            <span class="value">{{ totalClientes() }}</span>
          </div>
        </div>
        <div class="stat-card glass">
          <i class="fas fa-scissors"></i>
          <div>
            <h3>Barberos</h3>
            <span class="value">{{ totalBarberos() }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container { padding: 2rem; color: white; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 2rem; }
    .stat-card { padding: 24px; background: rgba(255, 255, 255, 0.05); border-radius: 20px; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); border-color: #ffb703; }
    .stat-card i { font-size: 2.5rem; color: #ffb703; }
    .stat-card h3 { margin: 0; font-size: 1rem; color: rgba(255, 255, 255, 0.6); }
    .stat-card .value { font-size: 2rem; font-weight: 700; }
  `
})
export class DashboardComponent implements OnInit {
  public totalCitas = signal<number>(0);
  public totalClientes = signal<number>(0);
  public totalBarberos = signal<number>(0);

  constructor(private barberiaService: BarberiaService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.barberiaService.getCitas().subscribe(data => this.totalCitas.set(data.length));
    this.barberiaService.getClientes().subscribe(data => this.totalClientes.set(data.length));
    this.barberiaService.getBarberos().subscribe(data => this.totalBarberos.set(data.length));
  }
}
