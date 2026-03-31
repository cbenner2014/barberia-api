package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Pago;
import java.util.List;

public interface PagoService {
    List<Pago> listarTodos();
    Pago guardar(Pago pago);
    Pago buscarPorId(Integer id);
    void eliminar(Integer id);
}