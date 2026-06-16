package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Cita;
import com.proyecto.Modulos.repository.CitaRepository;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@WebService(serviceName = "CitaService")
public class CitaSoapService {

    @Autowired
    private CitaRepository citaRepository;

    @WebMethod
    public List<Cita> listarCitas() {
        return citaRepository.findAll();
    }

    @WebMethod
    public Cita buscarCitaPorId(@WebParam(name = "id") Integer id) {
        return citaRepository.findById(id).orElse(null);
    }
}
