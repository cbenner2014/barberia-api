package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.entity.Cita;
import com.proyecto.Modulos.entity.Rol;
import com.proyecto.Modulos.entity.Usuario;
import com.proyecto.Modulos.repository.UsuarioRepository;
import com.proyecto.Modulos.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Cita> listar(Authentication authentication) {
        if (authentication == null) return citaService.listarTodas();

        Usuario usuario = usuarioRepository.findByUsername(authentication.getName()).orElse(null);
        if (usuario == null) return citaService.listarTodas();

        if (usuario.getRol() == Rol.BARBERO && usuario.getBarbero() != null) {
            return citaService.listarPorBarbero(usuario.getBarbero().getIdBarbero());
        } else if (usuario.getRol() == Rol.CLIENTE && usuario.getCliente() != null) {
            return citaService.listarPorCliente(usuario.getCliente().getIdCliente());
        }

        return citaService.listarTodas();
    }

    @PostMapping
    public Cita guardar(@RequestBody Cita cita) {
        return citaService.guardar(cita);
    }
}