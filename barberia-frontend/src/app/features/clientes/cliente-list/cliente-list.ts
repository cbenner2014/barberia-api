import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cliente, Rol } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>Clientes</h2>
        <button *ngIf="authService.hasRole(Rol.ADMIN)" class="btn btn-primary" (click)="abrirModal()">
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
              <th *ngIf="authService.hasRole(Rol.ADMIN)">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes()">
              <td>{{ cliente.idCliente }}</td>
              <td>{{ cliente.nombreCliente }}</td>
              <td>{{ cliente.telefonoCliente }}</td>
              <td>{{ cliente.emailCliente }}</td>
              <td *ngIf="authService.hasRole(Rol.ADMIN)">
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
              <td [attr.colspan]="authService.hasRole(Rol.ADMIN) ? 5 : 4" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
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
    .table-card { background: rgba(30, 41, 59, 0.4); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 1.2rem 1rem; color: var(--primary); border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1.5px; font-weight: 700; }
    .table td { padding: 1.2rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); color: #f8fafc; font-size: 0.95rem; }
    .actions-group { display: flex; gap: 10px; }
    
    .btn-primary { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: #0f172a; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(203, 178, 106, 0.1); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(203, 178, 106, 0.2); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-ghost { background: transparent; color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
    .btn-ghost:hover { background: rgba(255,255,255,0.05); color: white; border-color: rgba(255,255,255,0.2); }

    .btn-icon { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #64748b; padding: 8px; border-radius: 8px; cursor: pointer; transition: 0.2s; }
    .btn-icon:hover { background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.1); }
    .btn-icon.edit:hover { color: var(--primary); }
    .btn-icon.delete:hover { color: #ef4444; }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(10px); }
    .modal-content { width: 100%; max-width: 520px; padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); background: #0f172a; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .modal-header h3 { color: var(--primary); margin: 0; font-size: 1.6rem; font-weight: 900; letter-spacing: -0.5px; }
    .btn-close { background: none; border: none; color: #475569; font-size: 1.8rem; cursor: pointer; transition: 0.3s; }
    .btn-close:hover { color: white; transform: rotate(90deg); }
    
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.6rem; color: #64748b; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .form-group input { width: 100%; padding: 14px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; color: white; outline: none; transition: 0.3s; font-size: 1rem; }
    .form-group input:focus { border-color: var(--primary); background: rgba(0,0,0,0.4); box-shadow: 0 0 15px rgba(203, 178, 106, 0.1); }
    .form-group input.invalid { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
    .error-text { color: #ef4444; font-size: 0.75rem; margin-top: 6px; font-weight: 600; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 15px; margin-top: 2.5rem; }
  `

})
export class ClienteListComponent implements OnInit {
  public clientes = signal<Cliente[]>([]);
  public mostrarModal = false;
  public editando = false;
  public clienteForm: FormGroup;
  public Rol = Rol;

  constructor(
    private barberiaService: BarberiaService,
    public authService: AuthService,
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
