package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.dto.BarberoDTO;
import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.repository.BarberoProyeccion;
import com.proyecto.Modulos.service.BarberoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barberos")
@CrossOrigin(origins = "*")
public class BarberoController {

    @Autowired
    private BarberoService barberoService;

    // Listar todos pero usando proyecciones (Optimización de respuesta, sin contraseñas)
    @GetMapping
    public ResponseEntity<List<BarberoProyeccion>> listarProyectado() {
        return ResponseEntity.ok(barberoService.listarProyectado());
    }

    // Buscador Avanzado (Consultas Dinámicas)
    @GetMapping("/buscar")
    public ResponseEntity<List<Barbero>> buscarConFiltros(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String email) {
        return ResponseEntity.ok(barberoService.buscarConFiltros(nombre, email));
    }
    
    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Barbero> obtenerPorId(@PathVariable Integer id) {
        Barbero barbero = barberoService.buscarPorId(id);
        if (barbero != null) {
            return ResponseEntity.ok(barbero);
        }
        return ResponseEntity.notFound().build();
    }

    // Crear barbero con Validación estricta (@Valid)
    @PostMapping
    public ResponseEntity<Barbero> guardar(@Valid @RequestBody BarberoDTO dto) {
        Barbero barbero = new Barbero();
        barbero.setNombreBarbero(dto.getNombreBarbero());
        barbero.setEdadBarbero(dto.getEdadBarbero());
        barbero.setEmailBarbero(dto.getEmailBarbero());
        barbero.setUsuarioBarbero(dto.getUsuarioBarbero());
        barbero.setContrasenaBarbero(dto.getContrasenaBarbero());
        
        Barbero barberoGuardado = barberoService.guardar(barbero);
        return ResponseEntity.status(HttpStatus.CREATED).body(barberoGuardado);
    }
    
    // Actualizar barbero
    @PutMapping("/{id}")
    public ResponseEntity<Barbero> actualizar(@PathVariable Integer id, @Valid @RequestBody BarberoDTO dto) {
        Barbero barberoExistente = barberoService.buscarPorId(id);
        if (barberoExistente != null) {
            barberoExistente.setNombreBarbero(dto.getNombreBarbero());
            barberoExistente.setEdadBarbero(dto.getEdadBarbero());
            barberoExistente.setEmailBarbero(dto.getEmailBarbero());
            barberoExistente.setUsuarioBarbero(dto.getUsuarioBarbero());
            
            // Solo actualiza la contraseña si se envía una nueva válida
            if (dto.getContrasenaBarbero() != null && !dto.getContrasenaBarbero().isEmpty()) {
                barberoExistente.setContrasenaBarbero(dto.getContrasenaBarbero());
            }
            
            return ResponseEntity.ok(barberoService.guardar(barberoExistente));
        }
        return ResponseEntity.notFound().build();
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if(barberoService.buscarPorId(id) != null) {
            barberoService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}