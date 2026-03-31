import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { Cliente } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>Clientes</h2>
        <button class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> Nuevo Cliente
        </button>
      </div>
      
      <div class="table-card glass">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes()">
              <td>{{ cliente.idCliente }}</td>
              <td>{{ cliente.nombreCliente }}</td>
              <td>{{ cliente.telefonoCliente }}</td>
              <td>{{ cliente.emailCliente }}</td>
              <td>
                <div class="actions-group">
                  <button class="btn-icon edit" (click)="editar(cliente)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="eliminar(cliente.idCliente!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="clientes().length === 0">
              <td colspan="5" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                No hay clientes registrados.
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
          <h3>{{ editando ? 'Editar' : 'Nuevo' }} Cliente</h3>
          <button class="btn-close" (click)="mostrarModal = false">&times;</button>
        </div>
        
        <form [formGroup]="clienteForm" (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" formControlName="nombreCliente" placeholder="Ej. Ana García"
                   [class.invalid]="clienteForm.get('nombreCliente')?.invalid && clienteForm.get('nombreCliente')?.touched">
            <small class="error-text" *ngIf="clienteForm.get('nombreCliente')?.invalid && clienteForm.get('nombreCliente')?.touched">
              * El nombre es obligatorio.
            </small>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Teléfono</label>
              <input type="text" formControlName="telefonoCliente" placeholder="Ej. 999 888 777"
                     [class.invalid]="clienteForm.get('telefonoCliente')?.invalid && clienteForm.get('telefonoCliente')?.touched">
              <small class="error-text" *ngIf="clienteForm.get('telefonoCliente')?.invalid && clienteForm.get('telefonoCliente')?.touched">
                * Teléfono requerido.
              </small>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="emailCliente" placeholder="ana@email.com"
                     [class.invalid]="clienteForm.get('emailCliente')?.invalid && clienteForm.get('emailCliente')?.touched">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="clienteForm.invalid">
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

    /* Modales igual que en barberos para consistencia */
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
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }
  `
})
export class ClienteListComponent implements OnInit {
  public clientes = signal<Cliente[]>([]);
  public mostrarModal = false;
  public editando = false;
  public clienteForm: FormGroup;

  constructor(
    private barberiaService: BarberiaService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      idCliente: [null],
      nombreCliente: ['', [Validators.required]],
      telefonoCliente: ['', [Validators.required]],
      emailCliente: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.barberiaService.getClientes().subscribe({
      next: (data) => this.clientes.set(data),
      error: (error) => console.error('Error cargando clientes', error)
    });
  }

  abrirModal(): void {
    this.editando = false;
    this.clienteForm.reset({ puntosAcumulados: 0 });
    this.mostrarModal = true;
  }

  guardar(): void {
    if (this.clienteForm.valid) {
      this.barberiaService.saveCliente(this.clienteForm.value).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.cargarClientes();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editar(cliente: Cliente): void {
    this.editando = true;
    this.clienteForm.patchValue(cliente);
    this.mostrarModal = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.barberiaService.deleteCliente(id).subscribe({
        next: () => this.cargarClientes(),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }
}
