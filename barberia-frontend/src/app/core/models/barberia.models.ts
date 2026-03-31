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

export interface Cita {
  idCita?: number;
  barbero: Barbero;
  cliente: Cliente;
  servicio: Servicio;
  fechaCita: string;
  horaCita: string;
  estadoCita: string;
}
