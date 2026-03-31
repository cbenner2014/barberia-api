package com.proyecto.Modulos.service.impl;

import com.proyecto.Modulos.entity.Servicio;
import com.proyecto.Modulos.repository.ServicioRepository;
import com.proyecto.Modulos.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServicioServiceImpl implements ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    public List<Servicio> listarTodos() {
        return servicioRepository.findAll();
    }

    @Override
    public Servicio guardar(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    @Override
    public Servicio buscarPorId(Integer id) {
        return servicioRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Integer id) {
        servicioRepository.deleteById(id);
    }
}