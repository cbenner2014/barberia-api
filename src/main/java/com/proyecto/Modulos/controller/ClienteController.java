package com.proyecto.Modulos.controller;

import com.proyecto.Modulos.dto.ClienteDTO;
import com.proyecto.Modulos.entity.Cliente;
import com.proyecto.Modulos.repository.ClienteProyeccion;
import com.proyecto.Modulos.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Listar todos pero usando proyecciones (Optimización de respuesta)
    @GetMapping
    public ResponseEntity<List<ClienteProyeccion>> listarProyectado() {
        return ResponseEntity.ok(clienteService.listarProyectado());
    }

    // Buscador Avanzado (Consultas Dinámicas)
    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscarConFiltros(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String telefono) {
        return ResponseEntity.ok(clienteService.buscarConFiltros(nombre, telefono));
    }
    
    // Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerPorId(@PathVariable Integer id) {
        Cliente cliente = clienteService.buscarPorId(id);
        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        }
        return ResponseEntity.notFound().build();
    }

    // Crear cliente con Validación estricta (@Valid)
    @PostMapping
    public ResponseEntity<Cliente> guardar(@Valid @RequestBody ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombreCliente(dto.getNombreCliente());
        cliente.setTelefonoCliente(dto.getTelefonoCliente());
        cliente.setEmailCliente(dto.getEmailCliente());
        
        Cliente clienteGuardado = clienteService.guardar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteGuardado);
    }
    
    // Actualizar cliente
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Integer id, @Valid @RequestBody ClienteDTO dto) {
        Cliente clienteExistente = clienteService.buscarPorId(id);
        if (clienteExistente != null) {
            clienteExistente.setNombreCliente(dto.getNombreCliente());
            clienteExistente.setTelefonoCliente(dto.getTelefonoCliente());
            clienteExistente.setEmailCliente(dto.getEmailCliente());
            
            return ResponseEntity.ok(clienteService.guardar(clienteExistente));
        }
        return ResponseEntity.notFound().build();
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if(clienteService.buscarPorId(id) != null) {
            clienteService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}