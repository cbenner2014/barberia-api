import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { Pago, Cita, MetodoPago } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-pago-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>Registro de Pagos</h2>
        <button class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> Registrar Pago
        </button>
      </div>
      
      <div class="table-card glass">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cita (Cliente)</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let pago of pagos()">
              <td>{{ pago.idPago }}</td>
              <td>#{{ pago.cita.idCita }} - {{ pago.cita.cliente.nombreCliente }}</td>
              <td>{{ pago.monto | currency }}</td>
              <td>
                <span class="method-badge" [ngClass]="pago.metodoPago.toLowerCase()">
                  {{ pago.metodoPago }}
                </span>
              </td>
              <td>{{ pago.fechaPago | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <div class="actions-group">
                  <button class="btn-icon edit" (click)="editar(pago)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="eliminar(pago.idPago!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="pagos().length === 0">
              <td colspan="6" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                No hay pagos registrados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="mostrarModal" (click)="cerrarModal($event)">
      <div class="modal-content glass" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editando ? 'Editar' : 'Nuevo' }} Pago</h3>
          <button class="btn-close" (click)="mostrarModal = false">&times;</button>
        </div>
        
        <form [formGroup]="pagoForm" (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Cita</label>
            <select formControlName="cita" [compareWith]="compareById('idCita')">
              <option [ngValue]="null" disabled>Selecciona la cita</option>
              <option *ngFor="let c of citas()" [ngValue]="c">
                #{{ c.idCita }} - {{ c.cliente.nombreCliente }} ({{ c.fecha }})
              </option>

            </select>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Monto</label>
              <input type="number" formControlName="monto" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label>Método de Pago</label>
              <select formControlName="metodoPago">
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Fecha y Hora de Pago</label>
            <input type="datetime-local" formControlName="fechaPago">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="pagoForm.invalid">
              Guardar
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
    
    .method-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .method-badge.efectivo { background: rgba(0, 204, 102, 0.2); color: #00cc66; }
    .method-badge.tarjeta { background: rgba(0, 153, 255, 0.2); color: #0099ff; }
    .method-badge.yape { background: rgba(153, 51, 255, 0.2); color: #9933ff; }
    .method-badge.plin { background: rgba(255, 51, 153, 0.2); color: #ff3399; }

    .actions-group { display: flex; gap: 10px; }
    .btn-primary { background: #ffb703; color: #121212; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.3s; }
    .btn-primary:hover { background: #e6a500; transform: translateY(-2px); }
    .btn-ghost { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; cursor: pointer; }

    .btn-icon { background: rgba(255,255,255,0.05); border: none; color: white; padding: 8px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    .btn-icon:hover { background: rgba(255,255,255,0.15); }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
    .modal-content { width: 100%; max-width: 500px; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .modal-header h3 { color: #ffb703; margin: 0; }
    .btn-close { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
    
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
    .form-group input, .form-group select { width: 100%; padding: 12px; background: #2a2a2a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; outline: none; transition: 0.3s; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2rem; }
  `
})
export class PagoListComponent implements OnInit {
  public pagos = signal<Pago[]>([]);
  public citas = signal<Cita[]>([]);
  public mostrarModal = false;
  public editando = false;
  public pagoForm: FormGroup;

  constructor(
    private barberiaService: BarberiaService,
    private fb: FormBuilder
  ) {
    this.pagoForm = this.fb.group({
      idPago: [null],
      cita: [null, [Validators.required]],
      monto: [null, [Validators.required, Validators.min(0)]],
      metodoPago: ['Efectivo', [Validators.required]],
      fechaPago: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.barberiaService.getPagos().subscribe(data => this.pagos.set(data));
    this.barberiaService.getCitas().subscribe(data => this.citas.set(data));
  }

  abrirModal(): void {
    this.editando = false;
    this.pagoForm.reset({ metodoPago: 'Efectivo', fechaPago: new Date().toISOString().slice(0, 16) });
    this.mostrarModal = true;
  }

  cerrarModal(event: any): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (this.pagoForm.valid) {
      this.barberiaService.savePago(this.pagoForm.value).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.cargarDatos();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editar(pago: Pago): void {
    this.editando = true;
    this.pagoForm.patchValue({
      ...pago,
      fechaPago: pago.fechaPago ? pago.fechaPago.slice(0, 16) : ''
    });
    this.mostrarModal = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este pago?')) {
      this.barberiaService.deletePago(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }

  compareById(prop: string) {
    return (a: any, b: any) => a && b ? a[prop] === b[prop] : a === b;
  }
}
