package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Horario;
import java.util.List;

public interface HorarioService {
    List<Horario> listarTodos();
    Horario guardar(Horario horario);
    Horario buscarPorId(Integer id);
    void eliminar(Integer id);
}