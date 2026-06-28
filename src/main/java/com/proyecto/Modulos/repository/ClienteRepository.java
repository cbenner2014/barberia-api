package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer>, JpaSpecificationExecutor<Cliente> {
    Optional<Cliente> findFirstByEmailCliente(String email);

    @Query("SELECT c.idCliente as idCliente, c.nombreCliente as nombreCliente, c.telefonoCliente as telefonoCliente, c.emailCliente as emailCliente FROM Cliente c " +
           "WHERE (:nombre IS NULL OR :nombre = '' OR LOWER(c.nombreCliente) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
           "AND (:telefono IS NULL OR :telefono = '' OR LOWER(c.telefonoCliente) LIKE LOWER(CONCAT('%', :telefono, '%'))) " +
           "AND (:email IS NULL OR :email = '' OR LOWER(c.emailCliente) LIKE LOWER(CONCAT('%', :email, '%')))")
    List<ClienteProyeccion> findAllProyectado(@org.springframework.data.repository.query.Param("nombre") String nombre,
                                              @org.springframework.data.repository.query.Param("telefono") String telefono,
                                              @org.springframework.data.repository.query.Param("email") String email);
}