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
            nuevoUsuario.setPassword("123456"); // Password por defecto para clientes
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
}