package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Cliente;
import java.util.List;

public interface ClienteService {
    List<Cliente> listarTodos();
    Cliente guardar(Cliente cliente);
    Cliente buscarPorId(Integer id);
    void eliminar(Integer id);
    
    // Métodos para Examen Final (Consultas dinámicas y Proyecciones)
    java.util.List<com.proyecto.Modulos.repository.ClienteProyeccion> listarProyectado(String nombre, String telefono, String email);
    List<Cliente> buscarConFiltros(String nombre, String telefono);
}