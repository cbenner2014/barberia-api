package com.proyecto.Modulos.repository;

import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.entity.Cliente;
import com.proyecto.Modulos.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByBarbero(Barbero barbero);
    Optional<Usuario> findByCliente(Cliente cliente);
}

