package com.proyecto.Modulos.service.impl;

import com.proyecto.Modulos.entity.Horario;
import com.proyecto.Modulos.repository.HorarioRepository;
import com.proyecto.Modulos.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HorarioServiceImpl implements HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    @Override
    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }

    @Override
    public Horario guardar(Horario horario) {
        return horarioRepository.save(horario);
    }

    @Override
    public Horario buscarPorId(Integer id) {
        return horarioRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Integer id) {
        horarioRepository.deleteById(id);
    }
}