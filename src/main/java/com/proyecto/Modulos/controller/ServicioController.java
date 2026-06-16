package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.dto.ServicioDTO;
import com.proyecto.Modulos.entity.Servicio;
import com.proyecto.Modulos.repository.ServicioProyeccion;
import com.proyecto.Modulos.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @GetMapping
    public ResponseEntity<List<ServicioProyeccion>> listarProyectado() {
        return ResponseEntity.ok(servicioService.listarProyectado());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Servicio>> buscarConFiltros(@RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(servicioService.buscarConFiltros(nombre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtenerPorId(@PathVariable Integer id) {
        Servicio servicio = servicioService.buscarPorId(id);
        if (servicio != null) {
            return ResponseEntity.ok(servicio);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Servicio> guardar(@Valid @RequestBody ServicioDTO dto) {
        Servicio servicio = new Servicio();
        servicio.setNombreServicio(dto.getNombreServicio());
        servicio.setPrecioServicio(dto.getPrecioServicio());
        servicio.setDuracionServicio(dto.getDuracionServicio());
        
        Servicio servicioGuardado = servicioService.guardar(servicio);
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioGuardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizar(@PathVariable Integer id, @Valid @RequestBody ServicioDTO dto) {
        Servicio servicioExistente = servicioService.buscarPorId(id);
        if (servicioExistente != null) {
            servicioExistente.setNombreServicio(dto.getNombreServicio());
            servicioExistente.setPrecioServicio(dto.getPrecioServicio());
            servicioExistente.setDuracionServicio(dto.getDuracionServicio());
            
            return ResponseEntity.ok(servicioService.guardar(servicioExistente));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if(servicioService.buscarPorId(id) != null) {
            servicioService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}