export interface Barbero {
  idBarbero?: number;
  nombreBarbero: string;
  edadBarbero: number;
  emailBarbero: string;
  usuarioBarbero: string;
  contrasenaBarbero: string;
}

export interface Cliente {
  idCliente?: number;
  nombreCliente: string;
  telefonoCliente: string;
  emailCliente: string;
}

export interface Servicio {
  idServicio?: number;
  nombreServicio: string;
  precioServicio: number;
  duracionServicio: number;
}

export type DiaSemana = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
export type EstadoCita = 'Programada' | 'Atendida' | 'Cancelada';
export type EstadoPago = 'Pagado' | 'Pendiente';
export type MetodoPago = 'Efectivo' | 'Tarjeta' | 'Yape' | 'Plin';

export interface Cita {
  idCita?: number;
  barbero: Barbero;
  cliente: Cliente;
  servicio: Servicio;
  fecha: string;
  hora: string;
  estado: string;
}


export interface Horario {
  idHorario?: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  barbero: Barbero;
}

export interface Pago {
  idPago?: number;
  monto: number;
  metodoPago: MetodoPago;
  fechaPago: string;
  cita: Cita;
}

