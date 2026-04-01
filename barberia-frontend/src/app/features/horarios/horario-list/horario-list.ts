import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberiaService } from '../../../core/services/barberia.service';
import { Barbero, Horario, DiaSemana } from '../../../core/models/barberia.models';

@Component({
  selector: 'app-horario-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="module-container">
      <div class="module-header">
        <h2>Horarios de Atención</h2>
        <button class="btn btn-primary" (click)="abrirModal()">
          <i class="fas fa-plus"></i> Nuevo Horario
        </button>
      </div>
      
      <div class="table-card glass">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Barbero</th>
              <th>Día</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let horario of horarios()">
              <td>{{ horario.idHorario }}</td>
              <td>{{ horario.barbero.nombreBarbero }}</td>
              <td>{{ horario.diaSemana }}</td>
              <td>{{ horario.horaInicio }}</td>
              <td>{{ horario.horaFin }}</td>
              <td>
                <div class="actions-group">
                  <button class="btn-icon edit" (click)="editar(horario)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" (click)="eliminar(horario.idHorario!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="horarios().length === 0">
              <td colspan="6" style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
                No hay horarios configurados.
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
          <h3>{{ editando ? 'Editar' : 'Nuevo' }} Horario</h3>
          <button class="btn-close" (click)="mostrarModal = false">&times;</button>
        </div>
        
        <form [formGroup]="horarioForm" (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Barbero</label>
            <select formControlName="barbero" [compareWith]="compareById('idBarbero')">
              <option [ngValue]="null" disabled>Selecciona un barbero</option>
              <option *ngFor="let b of barberos()" [ngValue]="b">{{ b.nombreBarbero }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Día de la Semana</label>
            <select formControlName="diaSemana">
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miercoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sabado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Hora Inicio</label>
              <input type="time" formControlName="horaInicio">
            </div>
            <div class="form-group">
              <label>Hora Fin</label>
              <input type="time" formControlName="horaFin">
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" (click)="mostrarModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="horarioForm.invalid">
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

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: height; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
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
export class HorarioListComponent implements OnInit {
  public horarios = signal<Horario[]>([]);
  public barberos = signal<Barbero[]>([]);
  public mostrarModal = false;
  public editando = false;
  public horarioForm: FormGroup;

  constructor(
    private barberiaService: BarberiaService,
    private fb: FormBuilder
  ) {
    this.horarioForm = this.fb.group({
      idHorario: [null],
      barbero: [null, [Validators.required]],
      diaSemana: ['Lunes', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.barberiaService.getHorarios().subscribe(data => this.horarios.set(data));
    this.barberiaService.getBarberos().subscribe(data => this.barberos.set(data));
  }

  abrirModal(): void {
    this.editando = false;
    this.horarioForm.reset({ diaSemana: 'Lunes' });
    this.mostrarModal = true;
  }

  cerrarModal(event: any): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (this.horarioForm.valid) {
      this.barberiaService.saveHorario(this.horarioForm.value).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.cargarDatos();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editar(horario: Horario): void {
    this.editando = true;
    this.horarioForm.patchValue(horario);
    this.mostrarModal = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este horario?')) {
      this.barberiaService.deleteHorario(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }

  compareById(prop: string) {
    return (a: any, b: any) => a && b ? a[prop] === b[prop] : a === b;
  }
}
