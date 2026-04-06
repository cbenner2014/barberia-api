import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Barbero, Cliente, Servicio, Cita, Rol } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>{{ authService.hasRole(Rol.CLIENTE) ? 'Mis Citas' : 'Gestión de Citas' }}</h2>
        <button *ngIf="authService.hasRole(Rol.ADMIN) || authService.hasRole(Rol.CLIENTE)" class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> {{ authService.hasRole(Rol.CLIENTE) ? 'Agendar Cita' : 'Nueva Cita' }}
        </button>
      </div>
      
      <div class="table-card glass">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th *ngIf="authService.hasRole(Rol.ADMIN)">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cita of citas()">
              <td>{{ cita.idCita }}</td>
              <td>{{ cita.cliente.nombreCliente }}</td>
              <td>{{ cita.barbero.nombreBarbero }}</td>
              <td>{{ cita.servicio.nombreServicio }}</td>
              <td>{{ cita.fecha | date:'dd/MM/yyyy' }}</td>
              <td>{{ cita.hora }}</td>
              <td>
                <span class="status-badge" [ngClass]="(cita.estado || '').toLowerCase()">
                  {{ cita.estado }}
                </span>
              </td>
              <td *ngIf="authService.hasRole(Rol.ADMIN)">
                <div class="actions-group">
                  <button class="btn-icon edit" (click)="editar(cita)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="eliminar(cita.idCita!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <!-- Modal para Crear/Editar -->
    <div class="modal-overlay" *ngIf="mostrarModal" (click)="cerrarModal($event)">
      <div class="modal-content glass" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editando ? 'Editar' : 'Programar' }} Cita</h3>
          <button class="btn-close" (click)="mostrarModal = false">&times;</button>
        </div>
        
        <form [formGroup]="citaForm" (ngSubmit)="guardar()">
          
          <!-- Cliente: Solo editable por ADMIN o si se está creando -->
          <div class="form-group" *ngIf="!authService.hasRole(Rol.CLIENTE)">
            <label>Cliente</label>
            <select formControlName="cliente" [compareWith]="compareById('idCliente')">
              <option [ngValue]="null" disabled>Selecciona un cliente</option>
              <option *ngFor="let c of clientes()" [ngValue]="c">{{ c.nombreCliente }}</option>
            </select>
          </div>

          <!-- Resto de campos protegidos si es BARBERO -->
          <div class="form-group">
            <label>Barbero</label>
            <select formControlName="barbero" [compareWith]="compareById('idBarbero')">
              <option [ngValue]="null" disabled>Selecciona un barbero</option>
              <option *ngFor="let b of barberos()" [ngValue]="b">{{ b.nombreBarbero }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Servicio</label>
            <select formControlName="servicio" [compareWith]="compareById('idServicio')">
              <option [ngValue]="null" disabled>Selecciona un servicio</option>
              <option *ngFor="let s of servicios()" [ngValue]="s">{{ s.nombreServicio }} - {{ s.precioServicio | currency }}</option>
            </select>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Fecha</label>
              <input type="date" formControlName="fecha">
            </div>
            <div class="form-group">
              <label>Hora</label>
              <input type="time" formControlName="hora">
            </div>
          </div>

          <div class="form-group">
            <label>Estado</label>
            <select formControlName="estado">
              <option value="Programada">Programada</option>
              <option value="Atendida">Atendida</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="citaForm.invalid">
              {{ editando ? 'Actualizar' : 'Agendar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    /* ... estilos anteriores ... */
    .module-container { padding: 2rem; color: white; }
    .table-card { background: rgba(255, 255, 255, 0.05); border-radius: 12px; overflow: hidden; margin-top: 1rem; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 1rem; color: #ffb703; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .table td { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
    .status-badge.programada { background: rgba(255, 183, 3, 0.2); color: #ffb703; }
    .status-badge.atendida { background: rgba(0, 204, 102, 0.2); color: #00cc66; }
    .status-badge.cancelada { background: rgba(255, 77, 77, 0.2); color: #ff4d4d; }
    .actions-group { display: flex; gap: 10px; }
    .btn-primary { background: #ffb703; color: #121212; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .btn-icon { background: rgba(255,255,255,0.05); border: none; color: white; padding: 8px; border-radius: 6px; cursor: pointer; }
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { width: 100%; max-width: 500px; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: #1a1a1a; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.7); }
    .form-group input, .form-group select { width: 100%; padding: 10px; background: #2a2a2a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; }
  `
})
export class CitaListComponent implements OnInit {
  public citas = signal<Cita[]>([]);
  public barberos = signal<Barbero[]>([]);
  public clientes = signal<Cliente[]>([]);
  public servicios = signal<Servicio[]>([]);
  public mostrarModal = false;
  public editando = false;
  public citaForm: FormGroup;
  public Rol = Rol;

  constructor(
    private barberiaService: BarberiaService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.citaForm = this.fb.group({
      idCita: [null],
      barbero: [null, [Validators.required]],
      cliente: [null, [Validators.required]],
      servicio: [null, [Validators.required]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      estado: ['Programada', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.barberiaService.getCitas().subscribe(data => this.citas.set(data));
    this.barberiaService.getBarberos().subscribe(data => this.barberos.set(data));
    this.barberiaService.getClientes().subscribe(data => this.clientes.set(data));
    this.barberiaService.getServicios().subscribe(data => this.servicios.set(data));
  }

  abrirModal(): void {
    this.editando = false;
    this.citaForm.reset({ estado: 'Programada' });
    this.citaForm.enable();

    if (this.authService.hasRole(Rol.CLIENTE)) {
      const clientId = this.authService.currentUser()?.idCliente;
      const clientObj = this.clientes().find(c => c.idCliente === clientId);
      if (clientObj) {
        this.citaForm.patchValue({ cliente: clientObj });
      }
    }
    
    this.mostrarModal = true;
  }

  editar(cita: Cita): void {
    this.editando = true;
    this.citaForm.reset();
    this.citaForm.patchValue(cita);
    this.citaForm.enable();

    // RESTRICCIÓN BARBERO: Solo puede cambiar el estado
    if (this.authService.hasRole(Rol.BARBERO)) {
      this.citaForm.get('cliente')?.disable();
      this.citaForm.get('barbero')?.disable();
      this.citaForm.get('servicio')?.disable();
      this.citaForm.get('fecha')?.disable();
      this.citaForm.get('hora')?.disable();
    }

    this.mostrarModal = true;
  }

  guardar(): void {
    if (this.citaForm.valid || (this.editando && this.authService.hasRole(Rol.BARBERO))) {
      // Usamos getRawValue para incluir los campos deshabilitados
      const data = this.citaForm.getRawValue();
      this.barberiaService.saveCita(data).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.cargarDatos();
        },
        error: (err) => alert('Error: ' + err.message)
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar cita?')) {
      this.barberiaService.deleteCita(id).subscribe(() => this.cargarDatos());
    }
  }

  cerrarModal(event: any): void {
    this.mostrarModal = false;
  }

  compareById(prop: string) {
    return (a: any, b: any) => a && b ? a[prop] === b[prop] : a === b;
  }
}
