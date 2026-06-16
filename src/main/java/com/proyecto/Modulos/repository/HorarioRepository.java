package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Integer>, JpaSpecificationExecutor<Horario> {
    
    @Query("SELECT h FROM Horario h")
    List<HorarioProyeccion> findAllProyectado();
}