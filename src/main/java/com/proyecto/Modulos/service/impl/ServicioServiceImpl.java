package com.proyecto.Modulos.service.impl;

import com.proyecto.Modulos.entity.Servicio;
import com.proyecto.Modulos.repository.ServicioRepository;
import com.proyecto.Modulos.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServicioServiceImpl implements ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    public List<Servicio> listarTodos() {
        return servicioRepository.findAll();
    }

    @Override
    public Servicio guardar(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    @Override
    public Servicio buscarPorId(Integer id) {
        return servicioRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Integer id) {
        servicioRepository.deleteById(id);
    }

    @Override
    public List<com.proyecto.Modulos.repository.ServicioProyeccion> listarProyectado() {
        return servicioRepository.findAllProyectado();
    }

    @Override
    public List<Servicio> buscarConFiltros(String nombre) {
        return servicioRepository.findAll((root, query, criteriaBuilder) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            if (nombre != null && !nombre.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("nombreServicio"), "%" + nombre + "%"));
            }
            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        });
    }
}