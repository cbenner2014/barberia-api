package com.proyecto.Modulos.service.impl;

import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.entity.Rol;
import com.proyecto.Modulos.entity.Usuario;
import com.proyecto.Modulos.repository.BarberoRepository;
import com.proyecto.Modulos.repository.UsuarioRepository;
import com.proyecto.Modulos.service.BarberoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class BarberoServiceImpl implements BarberoService {

    @Autowired
    private BarberoRepository barberoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Barbero> listarTodos() {
        return barberoRepository.findAll();
    }

    @Override
    @Transactional
    public Barbero guardar(Barbero barbero) {
        boolean esNuevo = (barbero.getIdBarbero() == null);
        
        // Asegurar contraseña por defecto si viene vacía
        if (barbero.getContrasenaBarbero() == null || barbero.getContrasenaBarbero().isEmpty()) {
            barbero.setContrasenaBarbero("123456");
        }
        
        Barbero barberoGuardado = barberoRepository.save(barbero);

        // Sincronizar con la tabla Usuario
        Optional<Usuario> usuarioExistente = usuarioRepository.findByBarbero(barberoGuardado);
        
        if (usuarioExistente.isEmpty()) {
            // Si no existe usuario para este barbero, lo creamos
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(barberoGuardado.getUsuarioBarbero() != null ? barberoGuardado.getUsuarioBarbero() : barberoGuardado.getEmailBarbero());
            nuevoUsuario.setPassword(barberoGuardado.getContrasenaBarbero());
            nuevoUsuario.setRol(Rol.BARBERO);
            nuevoUsuario.setBarbero(barberoGuardado);
            usuarioRepository.save(nuevoUsuario);
        } else {
            // Si ya existe, actualizamos los datos
            Usuario u = usuarioExistente.get();
            if (barberoGuardado.getUsuarioBarbero() != null) u.setUsername(barberoGuardado.getUsuarioBarbero());
            if (barberoGuardado.getContrasenaBarbero() != null) u.setPassword(barberoGuardado.getContrasenaBarbero());
            usuarioRepository.save(u);
        }

        return barberoGuardado;
    }

    @Override
    public Barbero buscarPorId(Integer id) {
        return barberoRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void eliminar(Integer id) {
        Barbero barbero = buscarPorId(id);
        if (barbero != null) {
            usuarioRepository.findByBarbero(barbero).ifPresent(u -> usuarioRepository.delete(u));
            barberoRepository.deleteById(id);
        }
    }
}