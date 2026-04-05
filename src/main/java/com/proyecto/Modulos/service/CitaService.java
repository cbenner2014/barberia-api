package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Cita;
import java.util.List;

public interface CitaService {
    List<Cita> listarTodas();
    List<Cita> listarPorBarbero(Integer idBarbero);
    List<Cita> listarPorCliente(Integer idCliente);
    Cita guardar(Cita cita);
    Cita buscarPorId(Integer id);
    void eliminar(Integer id);
}