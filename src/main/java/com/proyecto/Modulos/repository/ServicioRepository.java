package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer>, JpaSpecificationExecutor<Servicio> {
    
    @Query("SELECT s.idServicio as idServicio, s.nombreServicio as nombreServicio, s.precioServicio as precioServicio, s.duracionServicio as duracionServicio FROM Servicio s")
    List<ServicioProyeccion> findAllProyectado();
}