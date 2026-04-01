import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { Barbero, Cliente, Servicio, Cita, EstadoCita } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>Gestión de Citas</h2>
        <button class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> Nueva Cita
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
              <th>Acciones</th>
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
              <td>
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
            <tr *ngIf="citas().length === 0">
              <td colspan="8" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                No hay citas registradas.
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
          <div class="form-group">
            <label>Cliente</label>
            <select formControlName="cliente" [compareWith]="compareById('idCliente')">
              <option [ngValue]="null" disabled>Selecciona un cliente</option>
              <option *ngFor="let c of clientes()" [ngValue]="c">{{ c.nombreCliente }}</option>
            </select>
          </div>
          
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
    .module-container { padding: 2rem; color: white; }
    .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .table-card { background: rgba(255, 255, 255, 0.05); border-radius: 12px; overflow: hidden; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 1rem; color: #ffb703; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .table td { padding: 10px 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .status-badge.programada { background: rgba(255, 183, 3, 0.2); color: #ffb703; }
    .status-badge.atendida { background: rgba(0, 204, 102, 0.2); color: #00cc66; }
    .status-badge.cancelada { background: rgba(255, 77, 77, 0.2); color: #ff4d4d; }
    .actions-group { display: flex; gap: 10px; min-width: 90px; }
    
    .btn-primary { background: #ffb703; color: #121212; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s; }
    .btn-primary:hover { background: #e6a500; transform: translateY(-2px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-ghost { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); }

    .btn-icon { background: rgba(255,255,255,0.05); border: none; color: white; padding: 8px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    .btn-icon:hover { background: rgba(255,255,255,0.15); }
    .btn-icon.edit:hover { color: #ffb703; }
    .btn-icon.delete:hover { color: #ff4d4d; }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
    .modal-content { width: 100%; max-width: 500px; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h3 { color: #ffb703; margin: 0; }
    .btn-close { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
    
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
    .form-group input, .form-group select { width: 100%; padding: 12px; background: #2a2a2a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; outline: none; transition: 0.3s; }
    .form-group input:focus, .form-group select:focus { border-color: #ffb703; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }
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

  constructor(
    private barberiaService: BarberiaService,
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
    this.mostrarModal = true;
  }

  cerrarModal(event: any): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (this.citaForm.valid) {
      this.barberiaService.saveCita(this.citaForm.value).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.cargarDatos();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editar(cita: Cita): void {
    this.editando = true;
    this.citaForm.patchValue(cita);
    this.mostrarModal = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      this.barberiaService.deleteCita(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }

  compareById(prop: string) {
    return (a: any, b: any) => a && b ? a[prop] === b[prop] : a === b;
  }
}
