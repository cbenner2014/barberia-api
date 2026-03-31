package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Servicio;
import java.util.List;

public interface ServicioService {
    List<Servicio> listarTodos();
    Servicio guardar(Servicio servicio);
    Servicio buscarPorId(Integer id);
    void eliminar(Integer id);
}