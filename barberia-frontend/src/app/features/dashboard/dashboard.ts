import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberiaService } from '../../core/services/barberia.service';
import { AuthService } from '../../core/services/auth.service';
import { Rol, Cita } from '../../core/models/barberia.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>¡Hola, {{ authService.currentUser()?.username }}!</h1>
        <p>Bienvenido al Panel de Control de la Barbería.</p>
      </div>
      
      <!-- Admin & Barber Stats -->
      <div class="stats-grid" *ngIf="!authService.hasRole(Rol.CLIENTE)">
        <div class="stat-card glass">
          <i class="fas fa-calendar-alt"></i>
          <div>
            <h3>{{ authService.hasRole(Rol.ADMIN) ? 'Total Citas' : 'Mis Citas' }}</h3>
            <span class="value">{{ totalCitas() }}</span>
          </div>
        </div>
        <div class="stat-card glass" *ngIf="authService.hasRole(Rol.ADMIN) || authService.hasRole(Rol.BARBERO)">
          <i class="fas fa-users"></i>
          <div>
            <h3>{{ authService.hasRole(Rol.ADMIN) ? 'Total Clientes' : 'Mis Clientes' }}</h3>
            <span class="value">{{ totalClientes() }}</span>
          </div>
        </div>
        <div class="stat-card glass" *ngIf="authService.hasRole(Rol.ADMIN)">
          <i class="fas fa-clock"></i>
          <div>
            <h3>Horarios</h3>
            <span class="value">{{ totalHorarios() }}</span>
          </div>
        </div>
        <div class="stat-card glass" *ngIf="authService.hasRole(Rol.ADMIN)">
          <i class="fas fa-credit-card"></i>
          <div>
            <h3>Pagos</h3>
            <span class="value">{{ totalPagos() }}</span>
          </div>
        </div>
        <div class="stat-card glass" *ngIf="authService.hasRole(Rol.ADMIN)">
          <i class="fas fa-dollar-sign"></i>
          <div>
            <h3>Ganancias</h3>
            <span class="value">{{ totalGanancias() | currency }}</span>
          </div>
        </div>
      </div>

      <!-- Client Specific Dashboard -->
      <div class="client-dashboard" *ngIf="authService.hasRole(Rol.CLIENTE)">
        <div class="next-appointment glass" *ngIf="proximaCita(); else noCita">
          <div class="appointment-header">
            <i class="fas fa-clock"></i>
            <h3>Tu próxima cita</h3>
          </div>
          <div class="appointment-body">
            <div class="detail">
              <span class="label">Barbero</span>
              <span class="info">{{ proximaCita()?.barbero?.nombreBarbero }}</span>
            </div>
            <div class="detail">
              <span class="label">Fecha</span>
              <span class="info">{{ proximaCita()?.fecha | date:'fullDate' }}</span>
            </div>
            <div class="detail">
              <span class="label">Hora</span>
              <span class="info">{{ proximaCita()?.hora }}</span>
            </div>
          </div>
        </div>
        <ng-template #noCita>
          <div class="no-appointment glass">
            <p>No tienes citas programadas próximamente.</p>
            <button class="btn-book" routerLink="/citas">Agendar Ahora</button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container { padding: 2rem; color: white; }
    .welcome-section { margin-bottom: 3rem; }
    .welcome-section h1 { font-size: 2.5rem; color: #ffb703; margin: 0; }
    .welcome-section p { color: rgba(255,255,255,0.6); margin-top: 0.5rem; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .stat-card { padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 20px; display: flex; align-items: center; gap: 15px; border: 1px solid rgba(255, 255, 255, 0.1); transition: 0.3s; }
    .stat-card i { font-size: 2rem; color: #ffb703; }
    .stat-card h3 { margin: 0; font-size: 0.9rem; color: rgba(255, 255, 255, 0.6); }
    .stat-card .value { font-size: 1.5rem; font-weight: 700; }

    .client-dashboard { max-width: 600px; }
    .next-appointment { padding: 2rem; border-radius: 24px; border: 1px solid rgba(255, 183, 3, 0.3); background: rgba(255, 183, 3, 0.05); }
    .appointment-header { display: flex; align-items: center; gap: 15px; margin-bottom: 2rem; }
    .appointment-header i { font-size: 1.5rem; color: #ffb703; }
    .appointment-header h3 { margin: 0; font-size: 1.2rem; }
    .appointment-body { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .detail { display: flex; flex-direction: column; gap: 5px; }
    .detail .label { font-size: 0.8rem; color: rgba(255,255,255,0.4); text-transform: uppercase; }
    .detail .info { font-weight: 600; font-size: 1rem; }

    .no-appointment { padding: 3rem; text-align: center; border-radius: 24px; }
    .btn-book { margin-top: 1.5rem; padding: 12px 24px; background: #ffb703; color: #121212; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .btn-book:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255, 183, 3, 0.2); }
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
  
  public proximaCita = signal<Cita | null>(null);
  public Rol = Rol;

  constructor(
    private barberiaService: BarberiaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.barberiaService.getCitas().subscribe(data => {
      this.totalCitas.set(data.length);
      if (this.authService.hasRole(Rol.CLIENTE) && data.length > 0) {
        // Encontrar la próxima cita más cercana
        const now = new Date();
        const futureCitas = data
          .filter(c => new Date(c.fecha) >= now || c.estado === 'Programada')
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        this.proximaCita.set(futureCitas[0] || null);
      }
    });

    if (this.authService.hasRole(Rol.ADMIN) || this.authService.hasRole(Rol.BARBERO)) {
      this.barberiaService.getClientes().subscribe(data => this.totalClientes.set(data.length));
    }

    if (this.authService.hasRole(Rol.ADMIN)) {
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
}
