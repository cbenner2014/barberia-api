package com.proyecto.Modulos.service.impl;

import com.proyecto.Modulos.entity.Cliente;
import com.proyecto.Modulos.entity.Rol;
import com.proyecto.Modulos.entity.Usuario;
import com.proyecto.Modulos.repository.ClienteRepository;
import com.proyecto.Modulos.repository.UsuarioRepository;
import com.proyecto.Modulos.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @Override
    @Transactional
    public Cliente guardar(Cliente cliente) {
        boolean esNuevo = (cliente.getIdCliente() == null);
        Cliente clienteGuardado = clienteRepository.save(cliente);

        // Sincronizar con la tabla Usuario
        if (esNuevo) {
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(clienteGuardado.getEmailCliente());
            nuevoUsuario.setPassword(passwordEncoder.encode("123456")); // Password por defecto encriptado
            nuevoUsuario.setRol(Rol.CLIENTE);
            nuevoUsuario.setCliente(clienteGuardado);
            usuarioRepository.save(nuevoUsuario);
        } else {
            // Si el email cambió, actualizamos el username del usuario
            Optional<Usuario> usuarioExistente = usuarioRepository.findByCliente(clienteGuardado);
            if (usuarioExistente.isPresent()) {
                Usuario u = usuarioExistente.get();
                u.setUsername(clienteGuardado.getEmailCliente());
                usuarioRepository.save(u);
            }
        }

        return clienteGuardado;
    }

    @Override
    public Cliente buscarPorId(Integer id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void eliminar(Integer id) {
        Cliente cliente = buscarPorId(id);
        if (cliente != null) {
            // Primero eliminamos el usuario asociado if exists
            usuarioRepository.findByCliente(cliente).ifPresent(u -> usuarioRepository.delete(u));
            clienteRepository.deleteById(id);
        }
    }

    @Override
    public List<com.proyecto.Modulos.repository.ClienteProyeccion> listarProyectado() {
        return clienteRepository.findAllProyectado();
    }

    @Override
    public List<Cliente> buscarConFiltros(String nombre, String telefono) {
        return clienteRepository.findAll((root, query, criteriaBuilder) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            
            if (nombre != null && !nombre.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("nombreCliente"), "%" + nombre + "%"));
            }
            if (telefono != null && !telefono.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("telefonoCliente"), "%" + telefono + "%"));
            }
            
            return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        });
    }
}