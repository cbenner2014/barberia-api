package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.service.BarberoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barberos")
@CrossOrigin(origins = "*")
public class BarberoController {

    @Autowired
    private BarberoService barberoService;

    @GetMapping
    public List<Barbero> listar() {
        return barberoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Barbero> obtenerPorId(@PathVariable Integer id) {
        Barbero barbero = barberoService.buscarPorId(id);
        return barbero != null ? ResponseEntity.ok(barbero) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Barbero guardar(@RequestBody Barbero barbero) {
        return barberoService.guardar(barbero);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        barberoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}