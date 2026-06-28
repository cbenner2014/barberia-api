package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Barbero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarberoRepository extends JpaRepository<Barbero, Integer>, JpaSpecificationExecutor<Barbero> {
    Optional<Barbero> findFirstByEmailBarbero(String email);

    @Query("SELECT b.idBarbero as idBarbero, b.nombreBarbero as nombreBarbero, b.edadBarbero as edadBarbero, b.emailBarbero as emailBarbero, b.usuarioBarbero as usuarioBarbero FROM Barbero b " +
           "WHERE (:nombre IS NULL OR :nombre = '' OR LOWER(b.nombreBarbero) LIKE LOWER(CONCAT('%', :nombre, '%'))) " +
           "AND (:edad IS NULL OR CAST(b.edadBarbero AS string) LIKE CONCAT('%', :edad, '%')) " +
           "AND (:email IS NULL OR :email = '' OR LOWER(b.emailBarbero) LIKE LOWER(CONCAT('%', :email, '%')))")
    List<BarberoProyeccion> findAllProyectado(@org.springframework.data.repository.query.Param("nombre") String nombre,
                                              @org.springframework.data.repository.query.Param("edad") String edad,
                                              @org.springframework.data.repository.query.Param("email") String email);
}