package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.dto.CitaDTO;
import com.proyecto.Modulos.entity.*;
import com.proyecto.Modulos.repository.UsuarioRepository;
import com.proyecto.Modulos.repository.BarberoRepository;
import com.proyecto.Modulos.service.BarberoService;
import com.proyecto.Modulos.service.CitaService;
import com.proyecto.Modulos.service.ClienteService;
import com.proyecto.Modulos.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @Autowired
    private BarberoService barberoService;
    @Autowired
    private ClienteService clienteService;
    @Autowired
    private ServicioService servicioService;

    @GetMapping
    public ResponseEntity<List<Cita>> listar(Authentication authentication) {
        if (authentication == null) return ResponseEntity.ok(citaService.listarTodas());

        Usuario usuario = usuarioRepository.findByUsername(authentication.getName()).orElse(null);
        if (usuario == null || usuario.getRol() == Rol.ADMIN) {
            return ResponseEntity.ok(citaService.listarTodas());
        }

        if (usuario.getRol() == Rol.BARBERO) {
            if (usuario.getBarbero() != null) {
                return ResponseEntity.ok(citaService.buscarConFiltros(usuario.getBarbero().getIdBarbero(), null));
            }
            String nombreBuscado = usuario.getUsername().split("@")[0];
            List<Barbero> todos = barberoRepository.findAll();
            Optional<Barbero> coincidencia = todos.stream()
                .filter(b -> b.getNombreBarbero().equalsIgnoreCase(nombreBuscado))
                .findFirst();
            if (coincidencia.isPresent()) {
                return ResponseEntity.ok(citaService.buscarConFiltros(coincidencia.get().getIdBarbero(), null));
            }
        }

        if (usuario.getRol() == Rol.CLIENTE && usuario.getCliente() != null) {
            return ResponseEntity.ok(citaService.buscarConFiltros(null, usuario.getCliente().getIdCliente()));
        }

        return ResponseEntity.ok(citaService.listarTodas());
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<Cita>> buscarConFiltros(@RequestParam(required = false) Integer idBarbero, @RequestParam(required = false) Integer idCliente) {
        return ResponseEntity.ok(citaService.buscarConFiltros(idBarbero, idCliente));
    }

    @PostMapping
    public ResponseEntity<Cita> guardar(@Valid @RequestBody CitaDTO dto) {
        Cliente cliente = clienteService.buscarPorId(dto.getIdCliente());
        Barbero barbero = barberoService.buscarPorId(dto.getIdBarbero());
        Servicio servicio = servicioService.buscarPorId(dto.getIdServicio());

        if(cliente == null || barbero == null || servicio == null) {
            return ResponseEntity.badRequest().build();
        }

        Cita cita = new Cita();
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setEstado(dto.getEstado());
        cita.setEstadoPago(dto.getEstadoPago());
        cita.setCliente(cliente);
        cita.setBarbero(barbero);
        cita.setServicio(servicio);

        Cita citaGuardada = citaService.guardar(cita);
        return ResponseEntity.status(HttpStatus.CREATED).body(citaGuardada);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Cita> actualizar(@PathVariable Integer id, @Valid @RequestBody CitaDTO dto) {
        Cita citaExistente = citaService.buscarPorId(id);
        if (citaExistente != null) {
            Cliente cliente = clienteService.buscarPorId(dto.getIdCliente());
            Barbero barbero = barberoService.buscarPorId(dto.getIdBarbero());
            Servicio servicio = servicioService.buscarPorId(dto.getIdServicio());

            if(cliente == null || barbero == null || servicio == null) {
                return ResponseEntity.badRequest().build();
            }

            citaExistente.setFecha(dto.getFecha());
            citaExistente.setHora(dto.getHora());
            citaExistente.setEstado(dto.getEstado());
            citaExistente.setEstadoPago(dto.getEstadoPago());
            citaExistente.setCliente(cliente);
            citaExistente.setBarbero(barbero);
            citaExistente.setServicio(servicio);

            return ResponseEntity.ok(citaService.guardar(citaExistente));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if(citaService.buscarPorId(id) != null) {
            citaService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}