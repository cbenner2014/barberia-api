package com.proyecto.Modulos.service.impl;

import com.proyecto.Modulos.entity.Cita;
import com.proyecto.Modulos.repository.CitaRepository;
import com.proyecto.Modulos.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CitaServiceImpl implements CitaService {

    @Autowired
    private CitaRepository citaRepository;

    @Override
    public List<Cita> listarTodas() {
        return citaRepository.findAll();
    }

    @Override
    public List<Cita> listarPorBarbero(Integer idBarbero) {
        return citaRepository.findByBarberoIdBarbero(idBarbero);
    }

    @Override
    public List<Cita> listarPorCliente(Integer idCliente) {
        return citaRepository.findByClienteIdCliente(idCliente);
    }


    @Override
    public Cita guardar(Cita cita) {
        return citaRepository.save(cita);
    }

    @Override
    public Cita buscarPorId(Integer id) {
        return citaRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Integer id) {
        citaRepository.deleteById(id);
    }
}