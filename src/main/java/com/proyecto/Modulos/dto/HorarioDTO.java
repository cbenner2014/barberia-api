package com.proyecto.Modulos.dto;

import com.proyecto.Modulos.entity.DiaSemana;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class HorarioDTO {

    private Integer idHorario;

    @NotNull(message = "El día de la semana es obligatorio")
    private DiaSemana diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    @NotNull(message = "Debe asignar el horario a un barbero")
    private Integer idBarbero;
}
