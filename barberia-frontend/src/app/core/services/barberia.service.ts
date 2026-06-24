import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Barbero, Cliente, Servicio, Cita, Horario, Pago } from '../models/barberia.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BarberiaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Barberos
  getBarberos(filtros: any = {}): Observable<Barbero[]> {
    let params = new HttpParams();
    if (filtros.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros.edad) params = params.set('edad', filtros.edad);
    if (filtros.email) params = params.set('email', filtros.email);
    return this.http.get<Barbero[]>(`${this.apiUrl}/barberos`, { params });
  }

  getBarbero(id: number): Observable<Barbero> {
    return this.http.get<Barbero>(`${this.apiUrl}/barberos/${id}`);
  }

  saveBarbero(barbero: any): Observable<Barbero> {
    if (barbero.idBarbero) {
      return this.http.put<Barbero>(`${this.apiUrl}/barberos/${barbero.idBarbero}`, barbero);
    }
    return this.http.post<Barbero>(`${this.apiUrl}/barberos`, barbero);
  }

  deleteBarbero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/barberos/${id}`);
  }

  // Clientes
  getClientes(filtros: any = {}): Observable<Cliente[]> {
    let params = new HttpParams();
    if (filtros.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros.telefono) params = params.set('telefono', filtros.telefono);
    if (filtros.email) params = params.set('email', filtros.email);
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`, { params });
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
  }

  saveCliente(cliente: any): Observable<Cliente> {
    if (cliente.idCliente) {
      return this.http.put<Cliente>(`${this.apiUrl}/clientes/${cliente.idCliente}`, cliente);
    }
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
  }

  // Servicios
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }

  saveServicio(servicio: any): Observable<Servicio> {
    if (servicio.idServicio) {
      return this.http.put<Servicio>(`${this.apiUrl}/servicios/${servicio.idServicio}`, servicio);
    }
    return this.http.post<Servicio>(`${this.apiUrl}/servicios`, servicio);
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicios/${id}`);
  }

  // Citas
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas`);
  }

  saveCita(cita: any): Observable<Cita> {
    if (cita.idCita) {
      return this.http.put<Cita>(`${this.apiUrl}/citas/${cita.idCita}`, cita);
    }
    return this.http.post<Cita>(`${this.apiUrl}/citas`, cita);
  }

  deleteCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/citas/${id}`);
  }

  // Horarios
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios`);
  }

  saveHorario(horario: any): Observable<Horario> {
    if (horario.idHorario) {
      return this.http.put<Horario>(`${this.apiUrl}/horarios/${horario.idHorario}`, horario);
    }
    return this.http.post<Horario>(`${this.apiUrl}/horarios`, horario);
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios/${id}`);
  }

  // Pagos
  getPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/pagos`);
  }

  savePago(pago: any): Observable<Pago> {
    if (pago.idPago) {
      return this.http.put<Pago>(`${this.apiUrl}/pagos/${pago.idPago}`, pago);
    }
    return this.http.post<Pago>(`${this.apiUrl}/pagos`, pago);
  }

  deletePago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pagos/${id}`);
  }
}

