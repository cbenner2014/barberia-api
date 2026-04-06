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
    <div class="dashboard-wrapper">
      <!-- Header Seccion -->
      <header class="dashboard-header animate-fade-in">
        <div class="welcome-text">
          <h1>{{ getSaludo() }}, <span>{{ authService.currentUser()?.username }}</span></h1>
          <p>{{ getSubtitulo() }}</p>
        </div>
        <div class="date-badge glass">
          <i class="far fa-calendar-alt"></i>
          <span>{{ today | date:'fullDate' }}</span>
        </div>
      </header>

      <!-- Grid Principal -->
      <main class="dashboard-grid">
        
        <!-- KPIs para ADMIN -->
        <ng-container *ngIf="authService.hasRole(Rol.ADMIN)">
          <div class="kpi-card glass glow-amber animate-slide-up" style="--delay: 0.1s">
            <div class="icon-box"><i class="fas fa-calendar-check"></i></div>
            <div class="kpi-info">
              <span class="label">Total Citas</span>
              <h2 class="value">{{ totalCitas() }}</h2>
            </div>
            <div class="kpi-chart"><div class="bar" style="width: 70%"></div></div>
          </div>

          <div class="kpi-card glass glow-blue animate-slide-up" style="--delay: 0.2s">
            <div class="icon-box"><i class="fas fa-user-friends"></i></div>
            <div class="kpi-info">
              <span class="label">Clientes Activos</span>
              <h2 class="value">{{ totalClientes() }}</h2>
            </div>
            <div class="kpi-chart"><div class="bar" style="width: 45%"></div></div>
          </div>


          <div class="chart-section glass animate-slide-up" style="--delay: 0.4s">
            <h3>Distribución de Servicios</h3>
            <div class="custom-chart">
              <div class="chart-item" *ngFor="let s of topServicios()">
                <div class="label-box">
                  <span>{{ s.nombre }}</span>
                  <span>{{ s.porcentaje }}%</span>
                </div>
                <div class="progress-bg"><div class="progress-fill" [style.width.%]="s.porcentaje"></div></div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- KPIs para BARBERO -->
        <ng-container *ngIf="authService.hasRole(Rol.BARBERO)">
          <div class="kpi-card glass glow-amber animate-slide-up">
            <div class="icon-box"><i class="fas fa-cut"></i></div>
            <div class="kpi-info">
              <span class="label">Citas Asignadas</span>
              <h2 class="value">{{ totalCitas() }}</h2>
            </div>
          </div>

          <div class="kpi-card glass glow-blue animate-slide-up">
            <div class="icon-box"><i class="fas fa-users"></i></div>
            <div class="kpi-info">
              <span class="label">Clientes Atendidos</span>
              <h2 class="value">{{ totalClientes() }}</h2>
            </div>
          </div>

          <div class="agenda-section glass animate-slide-up">
            <h3>Mi Agenda de Hoy</h3>
            <div class="agenda-list" *ngIf="citasDeHoy().length > 0; else noAgenda">
              <div class="agenda-item glass" *ngFor="let cita of citasDeHoy()">
                <div class="time">{{ cita.hora }}</div>
                <div class="info">
                  <strong>{{ cita.cliente.nombreCliente }}</strong>
                  <span>{{ cita.servicio.nombreServicio }}</span>
                </div>
                <div class="status" [class]="cita.estado.toLowerCase()">{{ cita.estado }}</div>
              </div>
            </div>
            <ng-template #noAgenda>
              <p class="empty-state">No tienes citas para hoy.</p>
            </ng-template>
          </div>
        </ng-container>

        <!-- KPIs para CLIENTE -->
        <ng-container *ngIf="authService.hasRole(Rol.CLIENTE)">
          <div class="vip-card glass animate-slide-up">
            <div class="vip-header">
              <div class="chip"></div>
              <img src="https://ui-avatars.com/api/?name={{authService.currentUser()?.username}}&background=ffb703&color=121212" alt="Avatar">
            </div>
            <div class="vip-body">
              <span class="card-label">CLIENTE PREMIUM</span>
              <h2 class="card-name">{{ authService.currentUser()?.username }}</h2>
            </div>
            <div class="vip-footer">
              <span>Puntos de Fidelidad: 150</span>
              <i class="fas fa-star"></i>
            </div>
          </div>

          <div class="next-appointment-hero glass glow-amber animate-slide-up" *ngIf="proximaCita(); else noCita">
            <div class="hero-header">
              <i class="fas fa-bolt"></i>
              <h3>Tu Próxima Cita</h3>
            </div>
            <div class="hero-content">
              <div class="main-info">
                <span class="time">{{ proximaCita()?.hora }}</span>
                <span class="date">{{ proximaCita()?.fecha | date:'EEEE, d MMMM' }}</span>
              </div>
              <div class="sub-info">
                <p><i class="fas fa-id-badge"></i> {{ proximaCita()?.barbero?.nombreBarbero }}</p>
                <p><i class="fas fa-concierge-bell"></i> {{ proximaCita()?.servicio?.nombreServicio }}</p>
              </div>
            </div>
          </div>
          <ng-template #noCita>
            <div class="no-cita-hero glass animate-slide-up">
              <i class="fas fa-calendar-plus"></i>
              <h3>¿Necesitas un corte?</h3>
              <p>Agenda tu próxima visita en segundos.</p>
              <button class="btn-primary" routerLink="/citas">Agendar Ahora</button>
            </div>
          </ng-template>
        </ng-container>

      </main>
    </div>
  `,
  styles: `
    :host { 
      --primary: #cbb26a; 
      --bg: #0f172a; 
      --glass: rgba(30, 41, 59, 0.4); 
      --glass-border: rgba(255, 255, 255, 0.05); 
    }

    .dashboard-wrapper { padding: 2rem; min-height: 90vh; color: white; font-family: 'Inter', sans-serif; }

    /* Header Styles */
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
    .welcome-text h1 { font-size: 2.8rem; margin: 0; font-weight: 800; }
    .welcome-text h1 span { color: var(--primary); text-shadow: 0 0 30px rgba(203, 178, 106, 0.3); }
    .welcome-text p { color: #94a3b8; font-size: 1.1rem; margin-top: 0.5rem; }
    .date-badge { padding: 10px 20px; border-radius: 50px; display: flex; align-items: center; gap: 10px; font-weight: 600; border: 1px solid var(--glass-border); background: var(--glass); }

    /* Grid Layout */
    .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }

    /* Glass Effect */
    .glass { background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }

    /* KPI Cards */
    .kpi-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; position: relative; overflow: hidden; transition: transform 0.3s ease; }
    .kpi-card:hover { transform: translateY(-5px); }
    .kpi-card .icon-box { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
    .kpi-info .label { font-size: 0.8rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .kpi-info .value { font-size: 2.4rem; margin: 5px 0; font-weight: 900; color: #f8fafc; }
    .kpi-chart { height: 5px; background: rgba(255,255,255,0.05); border-radius: 10px; }
    .kpi-chart .bar { height: 100%; border-radius: 10px; }

    /* Glow Effects */
    .glow-amber { border-bottom: 3px solid #cbb26a; } .glow-amber .icon-box i, .glow-amber .bar { color: #cbb26a; background: #cbb26a; }
    .glow-blue { border-bottom: 3px solid #64748b; } .glow-blue .icon-box i, .glow-blue .bar { color: #94a3b8; background: #64748b; }

    /* Chart Section */
    .chart-section { grid-column: span 3; padding: 2.5rem; }
    .custom-chart { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-top: 2rem; }
    .chart-item { display: flex; flex-direction: column; gap: 12px; }
    .label-box { display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; color: #f8fafc; }
    .progress-bg { height: 10px; background: rgba(255,255,255,0.03); border-radius: 20px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #cbb26a, #b69c5e); border-radius: 20px; box-shadow: 0 0 15px rgba(203, 178, 106, 0.2); }

    /* Agenda Section */
    .agenda-section { grid-column: span 2; padding: 2.5rem; }
    .agenda-list { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 2rem; }
    .agenda-item { display: flex; align-items: center; padding: 1.2rem; gap: 25px; transition: 0.3s; }
    .agenda-item:hover { background: rgba(255,255,255,0.02); }
    .agenda-item .time { font-weight: 900; font-size: 1.2rem; color: var(--primary); min-width: 70px; }
    .agenda-item .info { flex: 1; display: flex; flex-direction: column; }
    .agenda-item .info strong { font-size: 1.1rem; color: #f8fafc; }
    .agenda-item .info span { color: #94a3b8; font-size: 0.9rem; }
    .agenda-item .status { padding: 6px 14px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .status.programada { background: rgba(203, 178, 106, 0.1); color: #cbb26a; border: 1px solid rgba(203, 178, 106, 0.1); }
    .status.atendida { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.1); }

    /* VIP Card */
    .vip-card { padding: 2.5rem; background: linear-gradient(135deg, #1e293b, #0f172a); display: flex; flex-direction: column; justify-content: space-between; height: 240px; position: relative; overflow: hidden; border: 1px solid rgba(203, 178, 106, 0.1); }
    .vip-card::after { content: ''; position: absolute; top: -30%; right: -20%; width: 250px; height: 250px; background: radial-gradient(circle, rgba(203, 178, 106, 0.1) 0%, transparent 70%); }
    .vip-header { display: flex; justify-content: space-between; align-items: flex-start; z-index: 1; }
    .chip { width: 50px; height: 35px; background: linear-gradient(135deg, #cbb26a, #8d7a45); border-radius: 8px; box-shadow: inset 0 0 10px rgba(0,0,0,0.2); }
    .vip-header img { width: 55px; height: 55px; border-radius: 50%; border: 2px solid var(--primary); padding: 2px; }
    .card-label { font-size: 0.75rem; letter-spacing: 3px; color: #94a3b8; font-weight: 700; }
    .card-name { font-size: 1.7rem; margin: 10px 0 0; text-transform: uppercase; font-weight: 900; color: #f8fafc; letter-spacing: 1px; }
    .vip-footer { display: flex; justify-content: space-between; align-items: center; color: var(--primary); font-weight: 800; font-size: 0.9rem; z-index: 1; }

    /* Hero Appointments */
    .next-appointment-hero { grid-column: span 2; padding: 3rem; background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid rgba(203, 178, 106, 0.05); display: flex; flex-direction: column; gap: 2rem; position: relative; overflow: hidden; }
    .next-appointment-hero::before { content: ''; position: absolute; bottom: -20%; left: -10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(203, 178, 106, 0.03) 0%, transparent 70%); }
    .hero-header { display: flex; align-items: center; gap: 12px; color: var(--primary); font-weight: 900; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px; }
    .hero-content { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
    .main-info .time { font-size: 5rem; font-weight: 900; line-height: 1; display: block; color: #f8fafc; }
    .main-info .date { font-size: 1.3rem; color: #94a3b8; font-weight: 600; margin-top: 10px; display: block; }
    .sub-info p { margin: 12px 0; font-size: 1.15rem; display: flex; align-items: center; gap: 12px; font-weight: 500; }
    .sub-info i { color: var(--primary); width: 24px; text-align: center; }

    .no-cita-hero { grid-column: span 2; padding: 4rem; text-align: center; }
    .no-cita-hero i { font-size: 4rem; color: rgba(255,255,255,0.05); margin-bottom: 1.5rem; }
    .btn-primary { background: linear-gradient(135deg, #cbb26a, #b69c5e); color: #0f172a; border: none; padding: 16px 35px; border-radius: 12px; font-weight: 900; cursor: pointer; margin-top: 1.5rem; transition: 0.3s; box-shadow: 0 10px 20px rgba(203, 178, 106, 0.15); }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(203, 178, 106, 0.25); }


    /* Animations */
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; opacity: 0; animation-delay: var(--delay, 0s); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    @media (max-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr 1fr; } .chart-section, .agenda-section, .next-appointment-hero { grid-column: span 2; } }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } .chart-section, .agenda-section, .next-appointment-hero { grid-column: span 1; } }
  `
})
export class DashboardComponent implements OnInit {
  public today = new Date();
  public totalCitas = signal<number>(0);
  public totalClientes = signal<number>(0);
  public totalBarberos = signal<number>(0);
  public totalServicios = signal<number>(0);
  public totalGanancias = signal<number>(0);
  public topServicios = signal<{nombre: string, porcentaje: number}[]>([]);
  public citasDeHoy = signal<Cita[]>([]);
  public proximaCita = signal<Cita | null>(null);
  public Rol = Rol;

  constructor(
    private barberiaService: BarberiaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.barberiaService.getCitas().subscribe(data => {
      this.totalCitas.set(data.length);
      
      // Filtrar citas de hoy para el barbero
      if (this.authService.hasRole(Rol.BARBERO)) {
        const todayStr = new Date().toISOString().split('T')[0];
        const barberoId = this.authService.currentUser()?.idBarbero;
        const agenda = data.filter(c => c.fecha === todayStr && c.barbero.idBarbero === barberoId);
        this.citasDeHoy.set(agenda);
      }

      // Encontrar próxima cita para el cliente
      if (this.authService.hasRole(Rol.CLIENTE)) {
        const clientId = this.authService.currentUser()?.idCliente;
        const userCitas = data.filter(c => c.cliente.idCliente === clientId && c.estado === 'Programada');
        userCitas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        this.proximaCita.set(userCitas[0] || null);
      }
    });

    if (this.authService.hasRole(Rol.ADMIN) || this.authService.hasRole(Rol.BARBERO)) {
      this.barberiaService.getClientes().subscribe(data => this.totalClientes.set(data.length));
    }

    if (this.authService.hasRole(Rol.ADMIN)) {
      this.barberiaService.getBarberos().subscribe(data => this.totalBarberos.set(data.length));
      this.barberiaService.getServicios().subscribe(data => {
        this.totalServicios.set(data.length);
        // Generar mock de distribución
        this.topServicios.set(data.slice(0, 3).map((s, i) => ({
          nombre: s.nombreServicio,
          porcentaje: [65, 20, 15][i] || 10
        })));
      });
      this.barberiaService.getPagos().subscribe(data => {
        const sum = data.reduce((acc, p) => acc + (p.monto || 0), 0);
        this.totalGanancias.set(sum);
      });
    }
  }

  getSaludo(): string {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  }

  getSubtitulo(): string {
    if (this.authService.hasRole(Rol.ADMIN)) return 'Resumen global de actividad y finanzas.';
    if (this.authService.hasRole(Rol.BARBERO)) return 'Tu agenda y rendimiento para hoy.';
    return 'Resumen de tu cuenta y próxima cita.';
  }
}
