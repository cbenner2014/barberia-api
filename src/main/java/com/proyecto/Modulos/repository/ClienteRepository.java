package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer>, JpaSpecificationExecutor<Cliente> {

    @Query("SELECT c.idCliente as idCliente, c.nombreCliente as nombreCliente, c.telefonoCliente as telefonoCliente, c.emailCliente as emailCliente FROM Cliente c")
    List<ClienteProyeccion> findAllProyectado();
}