import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { Barbero } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-barbero-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>Barberos</h2>
        <button class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> Nuevo Barbero
        </button>
      </div>
      
      <div class="table-card glass">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let barbero of barberos()">
              <td>{{ barbero.idBarbero }}</td>
              <td>{{ barbero.nombreBarbero }}</td>
              <td>{{ barbero.edadBarbero }}</td>
              <td>{{ barbero.emailBarbero }}</td>
              <td>
                <div class="actions-group">
                  <button class="btn-icon edit" (click)="editar(barbero)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="eliminar(barbero.idBarbero!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="barberos().length === 0">
              <td colspan="5" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                No hay barberos registrados.
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
          <h3>{{ editando ? 'Editar' : 'Nuevo' }} Barbero</h3>
          <button class="btn-close" (click)="mostrarModal = false">&times;</button>
        </div>
        
        <form [formGroup]="barberoForm" (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" formControlName="nombreBarbero" placeholder="Ej. Juan Perez" 
                   [class.invalid]="barberoForm.get('nombreBarbero')?.invalid && barberoForm.get('nombreBarbero')?.touched">
            <small class="error-text" *ngIf="barberoForm.get('nombreBarbero')?.invalid && barberoForm.get('nombreBarbero')?.touched">
              * El nombre es obligatorio.
            </small>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Edad</label>
              <input type="number" formControlName="edadBarbero" placeholder="Ej. 25"
                     [class.invalid]="barberoForm.get('edadBarbero')?.invalid && barberoForm.get('edadBarbero')?.touched">
              <small class="error-text" *ngIf="barberoForm.get('edadBarbero')?.errors?.['min'] && barberoForm.get('edadBarbero')?.touched">
                * Mínimo 18 años.
              </small>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="emailBarbero" placeholder="juan@mail.com"
                     [class.invalid]="barberoForm.get('emailBarbero')?.invalid && barberoForm.get('emailBarbero')?.touched">
            </div>
          </div>
          
          <div class="form-grid" style="margin-top: 15px;">
            <div class="form-group">
              <label>Usuario</label>
              <input type="text" formControlName="usuarioBarbero" placeholder="juanp01"
                     [class.invalid]="barberoForm.get('usuarioBarbero')?.invalid && barberoForm.get('usuarioBarbero')?.touched">
            </div>
            
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" formControlName="contrasenaBarbero" placeholder="******"
                     [class.invalid]="barberoForm.get('contrasenaBarbero')?.invalid && barberoForm.get('contrasenaBarbero')?.touched">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="barberoForm.invalid">
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
    .form-group input { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; outline: none; transition: 0.3s; }
    .form-group input:focus { border-color: #ffb703; background: rgba(255,255,255,0.1); }
    .form-group input.invalid { border-color: #ff4d4d; }
    .error-text { color: #ff4d4d; font-size: 0.75rem; margin-top: 4px; display: block; }
    .form-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 15px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }
  `
})
export class BarberoListComponent implements OnInit {
  public barberos = signal<Barbero[]>([]);
  public mostrarModal = false;
  public editando = false;
  public barberoForm: FormGroup;

  constructor(
    private barberiaService: BarberiaService,
    private fb: FormBuilder
  ) {
    this.barberoForm = this.fb.group({
      idBarbero: [null],
      nombreBarbero: ['', [Validators.required]],
      edadBarbero: [null, [Validators.required, Validators.min(18)]],
      emailBarbero: ['', [Validators.required, Validators.email]],
      usuarioBarbero: ['', [Validators.required]],
      contrasenaBarbero: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarBarberos();
  }

  cargarBarberos(): void {
    this.barberiaService.getBarberos().subscribe({
      next: (data) => this.barberos.set(data),
      error: (error) => console.error('Error cargando barberos', error)
    });
  }

  abrirModal(): void {
    this.editando = false;
    this.barberoForm.reset();
    this.mostrarModal = true;
  }

  cerrarModal(event: any): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (this.barberoForm.valid) {
      this.barberiaService.saveBarbero(this.barberoForm.value).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.cargarBarberos();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editar(barbero: Barbero): void {
    this.editando = true;
    this.barberoForm.patchValue(barbero);
    this.mostrarModal = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este barbero?')) {
      this.barberiaService.deleteBarbero(id).subscribe({
        next: () => this.cargarBarberos(),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }
}
