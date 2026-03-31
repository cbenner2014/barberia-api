import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { Servicio } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-servicio-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>Servicios</h2>
        <button class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> Nuevo Servicio
        </button>
      </div>
      
      <div class="table-card glass">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let servicio of servicios()">
              <td>{{ servicio.idServicio }}</td>
              <td>{{ servicio.nombreServicio }}</td>
              <td>{{ servicio.precioServicio | currency:'PEN':'S/.' }}</td>
              <td>{{ servicio.duracionServicio }} min</td>
              <td>
                <div class="actions-group">
                  <button class="btn-icon edit" (click)="editar(servicio)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="eliminar(servicio.idServicio!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="servicios().length === 0">
              <td colspan="5" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                No hay servicios registrados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear/Editar -->
    <div class="modal-overlay" *ngIf="mostrarModal" (click)="mostrarModal = false">
      <div class="modal-content glass" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editando ? 'Editar' : 'Nuevo' }} Servicio</h3>
          <button class="btn-close" (click)="mostrarModal = false">&times;</button>
        </div>
        
        <form [formGroup]="servicioForm" (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Nombre del Servicio</label>
            <input type="text" formControlName="nombreServicio" placeholder="Ej. Corte de Cabello"
                   [class.invalid]="servicioForm.get('nombreServicio')?.invalid && servicioForm.get('nombreServicio')?.touched">
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Precio (S/.)</label>
              <input type="number" formControlName="precioServicio" placeholder="20.00"
                     [class.invalid]="servicioForm.get('precioServicio')?.invalid && servicioForm.get('precioServicio')?.touched">
            </div>

            <div class="form-group">
              <label>Duración (min)</label>
              <input type="number" formControlName="duracionServicio" placeholder="30"
                     [class.invalid]="servicioForm.get('duracionServicio')?.invalid && servicioForm.get('duracionServicio')?.touched">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="servicioForm.invalid">
              {{ editando ? 'Actualizar' : 'Guardar' }}
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
    .table td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .actions-group { display: flex; gap: 10px; }
    
    .btn-primary { background: #ffb703; color: #121212; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s; }
    .btn-primary:hover { background: #e6a500; transform: translateY(-2px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-ghost { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); }

    .btn-icon { background: rgba(255,255,255,0.05); border: none; color: white; padding: 8px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    .btn-icon:hover { background: rgba(255,255,255,0.15); }
    .btn-icon.edit:hover { color: #ffb703; }
    .btn-icon.delete:hover { color: #ff4d4d; }

    /* Modales */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
    .modal-content { width: 100%; max-width: 500px; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h3 { color: #ffb703; margin: 0; }
    .btn-close { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
    
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; outline: none; transition: 0.3s; font-family: inherit; }
    .form-group input:focus, .form-group textarea:focus { border-color: #ffb703; background: rgba(255,255,255,0.1); }
    .form-group input.invalid { border-color: #ff4d4d; }
    .error-text { color: #ff4d4d; font-size: 0.75rem; margin-top: 4px; display: block; }
    .form-group textarea { height: 100px; resize: none; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }
  `
})
export class ServicioListComponent implements OnInit {
  public servicios = signal<Servicio[]>([]);
  public mostrarModal = false;
  public editando = false;
  public servicioForm: FormGroup;

  constructor(
    private barberiaService: BarberiaService,
    private fb: FormBuilder
  ) {
    this.servicioForm = this.fb.group({
      idServicio: [null],
      nombreServicio: ['', [Validators.required]],
      precioServicio: [null, [Validators.required, Validators.min(0)]],
      duracionServicio: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.barberiaService.getServicios().subscribe({
      next: (data) => this.servicios.set(data),
      error: (error) => console.error('Error cargando servicios', error)
    });
  }

  abrirModal(): void {
    this.editando = false;
    this.servicioForm.reset();
    this.mostrarModal = true;
  }

  guardar(): void {
    if (this.servicioForm.valid) {
      this.barberiaService.saveServicio(this.servicioForm.value).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.cargarServicios();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editar(servicio: Servicio): void {
    this.editando = true;
    this.servicioForm.patchValue(servicio);
    this.mostrarModal = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.barberiaService.deleteServicio(id).subscribe({
        next: () => this.cargarServicios(),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }
}
