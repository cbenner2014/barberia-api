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
          <i class="fas fa-clock"></i>
          <div>
            <h3>Horarios</h3>
            <span class="value">{{ totalHorarios() }}</span>
          </div>
        </div>
        <div class="stat-card glass">
          <i class="fas fa-credit-card"></i>
          <div>
            <h3>Pagos</h3>
            <span class="value">{{ totalPagos() }}</span>
          </div>
        </div>
        <div class="stat-card glass">
          <i class="fas fa-dollar-sign"></i>
          <div>
            <h3>Ganancias</h3>
            <span class="value">{{ totalGanancias() | currency }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container { padding: 2rem; color: white; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 2rem; }
    .stat-card { padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 16px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-5px); border-color: #ffb703; background: rgba(255, 255, 255, 0.08); }
    .stat-card i { font-size: 1.8rem; color: #ffb703; }
    .stat-card h3 { margin: 0; font-size: 0.85rem; color: rgba(255, 255, 255, 0.6); }
    .stat-card .value { font-size: 1.3rem; font-weight: 700; }
  `
})
export class DashboardComponent implements OnInit {
  public totalCitas = signal<number>(0);
  public totalClientes = signal<number>(0);
  public totalBarberos = signal<number>(0);
  public totalServicios = signal<number>(0);
  public totalHorarios = signal<number>(0);
  public totalPagos = signal<number>(0);
  public totalGanancias = signal<number>(0);

  constructor(private barberiaService: BarberiaService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.barberiaService.getCitas().subscribe(data => this.totalCitas.set(data.length));
    this.barberiaService.getClientes().subscribe(data => this.totalClientes.set(data.length));
    this.barberiaService.getBarberos().subscribe(data => this.totalBarberos.set(data.length));
    this.barberiaService.getServicios().subscribe(data => this.totalServicios.set(data.length));
    this.barberiaService.getHorarios().subscribe(data => this.totalHorarios.set(data.length));
    this.barberiaService.getPagos().subscribe(data => {
      this.totalPagos.set(data.length);
      const sum = data.reduce((acc, p) => acc + (p.monto || 0), 0);
      this.totalGanancias.set(sum);
    });
  }
}


