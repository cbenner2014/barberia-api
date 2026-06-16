package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.EstadoCita;
import com.proyecto.Modulos.entity.EstadoPago;
import java.time.LocalDate;
import java.time.LocalTime;

public interface CitaProyeccion {
    Integer getIdCita();
    LocalDate getFecha();
    LocalTime getHora();
    EstadoCita getEstado();
    EstadoPago getEstadoPago();
    
    ClienteInfo getCliente();
    ServicioInfo getServicio();
    BarberoInfo getBarbero();

    interface ClienteInfo {
        Integer getIdCliente();
        String getNombreCliente();
    }
    
    interface ServicioInfo {
        Integer getIdServicio();
        String getNombreServicio();
    }
    
    interface BarberoInfo {
        Integer getIdBarbero();
        String getNombreBarbero();
    }
}
