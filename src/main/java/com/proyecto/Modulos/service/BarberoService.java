package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Barbero;
import java.util.List;

public interface BarberoService {
    List<Barbero> listarTodos();
    Barbero guardar(Barbero barbero);
    Barbero buscarPorId(Integer id);
    void eliminar(Integer id);
}