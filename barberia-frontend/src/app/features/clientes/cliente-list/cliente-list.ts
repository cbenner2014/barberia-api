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
    <div class="modal-overlay" *ngIf="mostrarModal">
      <div class="modal-content glass" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editando ? 'Editar' : 'Nuevo' }} Cliente</h3>
          <button class="btn-close" (click)="mostrarModal = false">&times;</button>
        </div>
        
        <form [formGroup]="clienteForm" (ngSubmit)="guardar()">
          <!-- Alerta de Errores del Backend -->
          <div *ngIf="backendErrors" class="alert-error">
            <strong>Errores desde el servidor (Spring Boot):</strong>
            <ul>
              <li *ngFor="let error of objectKeys(backendErrors)">
                {{ backendErrors[error] }}
              </li>
            </ul>
          </div>
          
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
              <small class="error-text" *ngIf="clienteForm.get('emailCliente')?.errors?.['email'] && clienteForm.get('emailCliente')?.touched">
                * Debe incluir un "\@" (ej. correo\@mail.com).
              </small>
              <small class="error-text" *ngIf="clienteForm.get('emailCliente')?.errors?.['required'] && clienteForm.get('emailCliente')?.touched">
                * El email es obligatorio.
              </small>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary">
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: `
    .module-container { padding: 2rem; color: white; animation: fadeIn 0.4s ease-out; }
    .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .table-card { background: rgba(255, 255, 255, 0.03); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
    .table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .table th { text-align: left; padding: 1.2rem 1rem; color: #ffb703; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-weight: 600; letter-spacing: 0.5px; background: rgba(0,0,0,0.2); }
    .table td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); vertical-align: middle; transition: background 0.2s; }
    .table tbody tr:hover td { background: rgba(255,255,255,0.02); }
    
    .actions-group { display: flex; gap: 8px; }
    .btn-icon { background: rgba(255,255,255,0.05); border: none; color: white; width: 36px; height: 36px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
    .btn-icon:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
    .btn-icon.edit:hover { color: #ffb703; background: rgba(255,183,3,0.1); }
    .btn-icon.delete:hover { color: #ff4d4d; background: rgba(255,77,77,0.1); }

    .btn-primary { background: linear-gradient(135deg, #ffb703 0%, #ff9500 100%); color: #121212; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 183, 3, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 183, 3, 0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
    
    .btn-ghost { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }

    /* Modales Premium */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); animation: fadeIn 0.3s ease-out; }
    .modal-content { width: 100%; max-width: 550px; padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); background: rgba(20, 20, 20, 0.95); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); max-height: 90vh; overflow-y: auto; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    
    /* Scrollbar del modal */
    .modal-content::-webkit-scrollbar { width: 6px; }
    .modal-content::-webkit-scrollbar-track { background: transparent; margin: 10px 0; }
    .modal-content::-webkit-scrollbar-thumb { background: rgba(255,183,3,0.3); border-radius: 10px; }
    .modal-content::-webkit-scrollbar-thumb:hover { background: rgba(255,183,3,0.5); }

    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .modal-header h3 { color: #ffb703; margin: 0; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; }
    .btn-close { background: rgba(255,255,255,0.05); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; font-size: 1.2rem; line-height: 1; }
    .btn-close:hover { background: rgba(255,77,77,0.2); color: #ff4d4d; transform: rotate(90deg); }
    
    /* Formularios */
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.6rem; color: rgba(255,255,255,0.85); font-size: 0.9rem; font-weight: 500; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; outline: none; transition: all 0.3s ease; font-family: inherit; font-size: 0.95rem; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #ffb703; background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px rgba(255,183,3,0.1); }
    .form-group input.invalid, .form-group select.invalid { border-color: #ff4d4d; box-shadow: 0 0 0 4px rgba(255,77,77,0.1); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 15px; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
    
    /* Alerta Backend */
    .alert-error { background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); padding: 1.2rem; margin-bottom: 1.8rem; border-radius: 14px; animation: shake 0.5s ease-in-out; }
    .alert-error strong { color: #ef4444; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 0.95rem; }
    .alert-error strong::before { content: '\\26A0'; font-size: 1.1rem; }
    .alert-error ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .alert-error li { color: rgba(255, 204, 204, 0.9); font-size: 0.85rem; display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; }
    .alert-error li::before { content: '\\2022'; color: #ef4444; font-weight: bold; }
    .error-text { color: #ff4d4d; font-size: 0.8rem; margin-top: 6px; display: block; font-weight: 500; }

    /* Badges */
    .status-badge, .method-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
    .status-badge.programada { background: rgba(255, 183, 3, 0.15); color: #ffb703; border: 1px solid rgba(255, 183, 3, 0.3); }
    .status-badge.atendida { background: rgba(0, 204, 102, 0.15); color: #00cc66; border: 1px solid rgba(0, 204, 102, 0.3); }
    .status-badge.cancelada { background: rgba(255, 77, 77, 0.15); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3); }
    .method-badge.efectivo { background: rgba(0, 204, 102, 0.2); color: #00cc66; border: 1px solid rgba(0, 204, 102, 0.3); }
    .method-badge.tarjeta { background: rgba(0, 153, 255, 0.2); color: #0099ff; border: 1px solid rgba(0, 153, 255, 0.3); }
    .method-badge.yape { background: rgba(153, 51, 255, 0.2); color: #9933ff; border: 1px solid rgba(153, 51, 255, 0.3); }
    .method-badge.plin { background: rgba(255, 51, 153, 0.2); color: #ff3399; border: 1px solid rgba(255, 51, 153, 0.3); }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
  `
})
export class ClienteListComponent implements OnInit {
  public clientes = signal<Cliente[]>([]);
  public mostrarModal = false;
  public editando = false;
  public clienteForm: FormGroup;
  public Rol = Rol;
  public backendErrors: any = null;

  objectKeys = Object.keys;

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
    this.backendErrors = null;
    this.mostrarModal = true;
  }

  guardar(): void {
    this.backendErrors = null;
    this.barberiaService.saveCliente(this.clienteForm.value).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.cargarClientes();
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          this.backendErrors = err.error;
        } else {
          alert('Error al guardar: ' + err.message);
        }
      }
    });
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
