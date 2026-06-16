package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.dto.HorarioDTO;
import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.entity.DiaSemana;
import com.proyecto.Modulos.entity.Horario;
import com.proyecto.Modulos.repository.HorarioProyeccion;
import com.proyecto.Modulos.service.BarberoService;
import com.proyecto.Modulos.service.HorarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @Autowired
    private BarberoService barberoService;

    @GetMapping
    public ResponseEntity<List<HorarioProyeccion>> listarProyectado() {
        return ResponseEntity.ok(horarioService.listarProyectado());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Horario>> buscarConFiltros(@RequestParam(required = false) DiaSemana dia) {
        return ResponseEntity.ok(horarioService.buscarConFiltros(dia));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> obtenerPorId(@PathVariable Integer id) {
        Horario horario = horarioService.buscarPorId(id);
        if (horario != null) {
            return ResponseEntity.ok(horario);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Horario> guardar(@Valid @RequestBody HorarioDTO dto) {
        Barbero barbero = barberoService.buscarPorId(dto.getIdBarbero());
        if (barbero == null) {
            return ResponseEntity.badRequest().build();
        }

        Horario horario = new Horario();
        horario.setDiaSemana(dto.getDiaSemana());
        horario.setHoraInicio(dto.getHoraInicio());
        horario.setHoraFin(dto.getHoraFin());
        horario.setBarbero(barbero);

        Horario horarioGuardado = horarioService.guardar(horario);
        return ResponseEntity.status(HttpStatus.CREATED).body(horarioGuardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> actualizar(@PathVariable Integer id, @Valid @RequestBody HorarioDTO dto) {
        Horario horarioExistente = horarioService.buscarPorId(id);
        if (horarioExistente != null) {
            Barbero barbero = barberoService.buscarPorId(dto.getIdBarbero());
            if (barbero == null) {
                return ResponseEntity.badRequest().build();
            }

            horarioExistente.setDiaSemana(dto.getDiaSemana());
            horarioExistente.setHoraInicio(dto.getHoraInicio());
            horarioExistente.setHoraFin(dto.getHoraFin());
            horarioExistente.setBarbero(barbero);

            return ResponseEntity.ok(horarioService.guardar(horarioExistente));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if(horarioService.buscarPorId(id) != null) {
            horarioService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}