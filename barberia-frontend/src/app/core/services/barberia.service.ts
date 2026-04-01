import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Barbero, Cliente, Servicio, Cita, Horario, Pago } from '../models/barberia.models';

@Injectable({
  providedIn: 'root'
})
export class BarberiaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Barberos
  getBarberos(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(`${this.apiUrl}/barberos`);
  }

  getBarbero(id: number): Observable<Barbero> {
    return this.http.get<Barbero>(`${this.apiUrl}/barberos/${id}`);
  }

  saveBarbero(barbero: Barbero): Observable<Barbero> {
    return this.http.post<Barbero>(`${this.apiUrl}/barberos`, barbero);
  }

  deleteBarbero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/barberos/${id}`);
  }

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
  }

  saveCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
  }

  // Servicios
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }

  saveServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiUrl}/servicios`, servicio);
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicios/${id}`);
  }

  // Citas
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas`);
  }

  saveCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/citas`, cita);
  }

  deleteCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/citas/${id}`);
  }

  // Horarios
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios`);
  }

  saveHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(`${this.apiUrl}/horarios`, horario);
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/horarios/${id}`);
  }

  // Pagos
  getPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/pagos`);
  }

  savePago(pago: Pago): Observable<Pago> {
    return this.http.post<Pago>(`${this.apiUrl}/pagos`, pago);
  }

  deletePago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pagos/${id}`);
  }
}

