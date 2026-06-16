package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.DiaSemana;
import java.time.LocalTime;

public interface HorarioProyeccion {
    Integer getIdHorario();
    DiaSemana getDiaSemana();
    LocalTime getHoraInicio();
    LocalTime getHoraFin();
    BarberoInfo getBarbero();

    interface BarberoInfo {
        Integer getIdBarbero();
        String getNombreBarbero();
    }
}
