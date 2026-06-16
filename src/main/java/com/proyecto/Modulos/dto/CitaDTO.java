package com.proyecto.Modulos.dto;

import com.proyecto.Modulos.entity.EstadoCita;
import com.proyecto.Modulos.entity.EstadoPago;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CitaDTO {

    private Integer idCita;

    @NotNull(message = "La fecha es obligatoria")
    @FutureOrPresent(message = "La cita no puede ser en el pasado")
    private LocalDate fecha;

    @NotNull(message = "La hora es obligatoria")
    private LocalTime hora;

    @NotNull(message = "El estado de la cita es obligatorio")
    private EstadoCita estado;

    @NotNull(message = "El estado del pago es obligatorio")
    private EstadoPago estadoPago;

    @NotNull(message = "Debe asignar un cliente")
    private Integer idCliente;

    @NotNull(message = "Debe asignar un servicio")
    private Integer idServicio;

    @NotNull(message = "Debe asignar un barbero")
    private Integer idBarbero;
}
