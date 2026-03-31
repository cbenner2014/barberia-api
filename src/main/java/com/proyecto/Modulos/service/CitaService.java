package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Cita;
import java.util.List;

public interface CitaService {
    List<Cita> listarTodas();
    Cita guardar(Cita cita);
    Cita buscarPorId(Integer id);
    void eliminar(Integer id);
}