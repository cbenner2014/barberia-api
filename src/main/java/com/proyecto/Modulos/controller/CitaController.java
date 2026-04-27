package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.entity.Cita;
import com.proyecto.Modulos.entity.Rol;
import com.proyecto.Modulos.entity.Usuario;
import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.repository.UsuarioRepository;
import com.proyecto.Modulos.repository.BarberoRepository;
import com.proyecto.Modulos.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BarberoRepository barberoRepository;

    @GetMapping
    public List<Cita> listar(Authentication authentication) {
        if (authentication == null) return citaService.listarTodas();

        Usuario usuario = usuarioRepository.findByUsername(authentication.getName()).orElse(null);
        if (usuario == null) return citaService.listarTodas();

        // Lógica para ADMIN: ve todas
        if (usuario.getRol() == Rol.ADMIN) return citaService.listarTodas();

        // Lógica para BARBERO
        if (usuario.getRol() == Rol.BARBERO) {
            // 1. Intentar por vínculo directo de ID
            if (usuario.getBarbero() != null) {
                return citaService.listarPorBarbero(usuario.getBarbero().getIdBarbero());
            }
            
            // 2. Si no hay vínculo, intentar buscar un barbero que se llame igual que el username (sin el @gmail.com)
            String nombreBuscado = usuario.getUsername().split("@")[0];
            List<Barbero> todos = barberoRepository.findAll();
            Optional<Barbero> coincidencia = todos.stream()
                .filter(b -> b.getNombreBarbero().equalsIgnoreCase(nombreBuscado))
                .findFirst();
            
            if (coincidencia.isPresent()) {
                return citaService.listarPorBarbero(coincidencia.get().getIdBarbero());
            }
        }

        // Lógica para CLIENTE
        if (usuario.getRol() == Rol.CLIENTE && usuario.getCliente() != null) {
            return citaService.listarPorCliente(usuario.getCliente().getIdCliente());
        }

        return citaService.listarTodas();
    }

    @PostMapping
    public Cita guardar(@RequestBody Cita cita) {
        return citaService.guardar(cita);
    }
}