package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Barbero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BarberoRepository extends JpaRepository<Barbero, Integer> {
}