package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer>, JpaSpecificationExecutor<Cita> {
    List<Cita> findByBarberoIdBarbero(Integer idBarbero);
    List<Cita> findByClienteIdCliente(Integer idCliente);
    
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Cita c")
    List<CitaProyeccion> findAllProyectado();
}