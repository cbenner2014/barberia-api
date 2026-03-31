package com.proyecto.Modulos.service.impl; // Nota que ahora dice .impl

import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.repository.BarberoRepository;
import com.proyecto.Modulos.service.BarberoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // Esto le dice a Spring: "Este es el cocinero que sabe hacer las tareas"
public class BarberoServiceImpl implements BarberoService {

    @Autowired
    private BarberoRepository barberoRepository; // Llamamos al repositorio que ya hiciste

    @Override
    public List<Barbero> listarTodos() {
        return barberoRepository.findAll();
    }

    @Override
    public Barbero guardar(Barbero barbero) {
        return barberoRepository.save(barbero);
    }

    @Override
    public Barbero buscarPorId(Integer id) {
        return barberoRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Integer id) {
        barberoRepository.deleteById(id);
    }
}