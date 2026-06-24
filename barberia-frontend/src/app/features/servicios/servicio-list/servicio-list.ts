import { Component, OnInit, signal, computed } from '@angular/core';
import Swal from 'sweetalert2';
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
        
        <div class="header-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar..." (input)="onSearch($event)">
          </div>
          <button class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> Nuevo Servicio
        </button>
        </div>
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
            <tr *ngFor="let servicio of filteredData()">
              <td>{{ servicio.idServicio }}</td>
              <td>{{ servicio.nombreServicio }}</td>
              <td>{{ servicio.precioServicio | currency:'PEN':'S/.' }}</td>
              <td>{{ servicio.duracionServicio }} min</td>
              <td>
                <div class="actions-group">
                  <button class="btn-icon view" (click)="verDetalle(servicio)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-icon edit" (click)="editar(servicio)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="eliminar(servicio.idServicio!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredData().length === 0">
              <td colspan="5" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                No hay servicios registrados.
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
            <button type="submit" class="btn btn-primary">
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Ver Detalle -->
    <div class="modal-overlay" *ngIf="verModalDetalle">
      <div class="modal-content glass" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Detalles del Registro</h3>
          <button class="btn-close" (click)="verModalDetalle = false">&times;</button>
        </div>
        
        <div class="detalle-grid" *ngIf="itemSeleccionado">
          <div class="detalle-item" *ngFor="let key of objectKeys(itemSeleccionado)">
            <label>{{ key | titlecase }}</label>
            <p *ngIf="typeof(itemSeleccionado[key]) !== 'object'">{{ itemSeleccionado[key] }}</p>
            <p *ngIf="typeof(itemSeleccionado[key]) === 'object'">{{ jsonStringify(itemSeleccionado[key]) }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" (click)="verModalDetalle = false">Cerrar</button>
        </div>
      </div>
    </div>
  `,
    styles: `
    .module-container { padding: 2rem; color: white; animation: fadeIn 0.4s ease-out; }
    .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    
    .header-actions { display: flex; gap: 15px; align-items: center; }
    .search-box { position: relative; display: flex; align-items: center; }
    .search-box i { position: absolute; left: 15px; color: rgba(255,255,255,0.5); }
    .search-box input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 10px 15px 10px 40px; border-radius: 12px; color: white; outline: none; width: 200px; transition: all 0.3s; }
    .search-box input:focus { border-color: #ffb703; width: 280px; background: rgba(0,0,0,0.5); }

    .table-card { background: rgba(255, 255, 255, 0.03); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
    .table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .table th { text-align: left; padding: 1.2rem 1rem; color: #ffb703; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-weight: 600; letter-spacing: 0.5px; background: rgba(0,0,0,0.2); }
    .table td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); vertical-align: middle; transition: background 0.2s; }
    .table tbody tr:hover td { background: rgba(255,255,255,0.02); }
    
    .actions-group { display: flex; gap: 8px; }
    .btn-icon { background: rgba(255,255,255,0.05); border: none; color: white; width: 36px; height: 36px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
    .btn-icon:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
    .btn-icon.view:hover { color: #00cc66; background: rgba(0,204,102,0.1); }
    .btn-icon.edit:hover { color: #ffb703; background: rgba(255,183,3,0.1); }
    .btn-icon.delete:hover { color: #ff4d4d; background: rgba(255,77,77,0.1); }

    .btn-primary { background: linear-gradient(135deg, #ffb703 0%, #ff9500 100%); color: #121212; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 183, 3, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 183, 3, 0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
    
    .btn-ghost { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }

    /* Detalles */
    .detalle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    .detalle-item { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
    .detalle-item label { display: block; font-size: 0.8rem; color: #ffb703; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .detalle-item p { margin: 0; color: white; font-size: 1rem; font-weight: 500; word-break: break-word; }
    
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
export class ServicioListComponent implements OnInit {
  public servicios = signal<Servicio[]>([]);
  
  public searchQuery = signal('');
  public filteredData = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const data = this.servicios();
    if (!query) return data;
    return data.filter((item: any) => {
      return Object.values(item).some(val => 
        val && val.toString().toLowerCase().includes(query)
      );
    });
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  public mostrarModal = false;
  public verModalDetalle = false;
  public itemSeleccionado: any = null;
  public typeof = (obj: any) => typeof obj;
  public jsonStringify = (obj: any) => obj ? JSON.stringify(obj) : 'N/A';
  public editando = false;
  public servicioForm: FormGroup;
  public backendErrors: any = null;
  objectKeys = Object.keys;

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

  
  verDetalle(item: any): void {
    this.itemSeleccionado = item;
    this.verModalDetalle = true;
  }

  abrirModal(): void {
    this.editando = false;
    this.servicioForm.reset();
    this.backendErrors = null;
    this.mostrarModal = true;
  }

  guardar(): void {
    this.backendErrors = null;
    this.barberiaService.saveServicio(this.servicioForm.value).subscribe({
      next: () => {
        Swal.fire({ title: '¡Éxito!', text: 'Guardado correctamente', icon: 'success', confirmButtonColor: '#ffb703', background: '#1a1a1a', color: '#fff' });
        this.mostrarModal = false;
        this.cargarServicios();
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          Swal.fire({ title: 'Error de validación', html: Object.values(err.error).map(e => `&bull; ${e}`).join('<br>'), icon: 'error', confirmButtonColor: '#ffb703', background: '#1a1a1a', color: '#fff' });
        } else {
          Swal.fire({ title: 'Error', text: 'Error al guardar: ' + err.message, icon: 'error', confirmButtonColor: '#ffb703', background: '#1a1a1a', color: '#fff' });
        }
      }
    });
  }

  editar(servicio: Servicio): void {
    this.editando = true;
    this.servicioForm.patchValue(servicio);
    this.mostrarModal = true;
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar este servicio??',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1a1a1a',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
      this.barberiaService.deleteServicio(id).subscribe({
        next: () => this.cargarServicios(),
        error: (err) => Swal.fire({ title: 'Error', text: 'Error al eliminar: ' + err.message, icon: 'error', confirmButtonColor: '#ffb703', background: '#1a1a1a', color: '#fff' })
      });
      }
    });
  }
}
