package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Barbero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface BarberoRepository extends JpaRepository<Barbero, Integer>, JpaSpecificationExecutor<Barbero> {

    @Query("SELECT b.idBarbero as idBarbero, b.nombreBarbero as nombreBarbero, b.edadBarbero as edadBarbero, b.emailBarbero as emailBarbero, b.usuarioBarbero as usuarioBarbero FROM Barbero b")
    List<BarberoProyeccion> findAllProyectado();
}