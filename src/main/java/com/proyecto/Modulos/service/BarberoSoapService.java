package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Barbero;
import com.proyecto.Modulos.repository.BarberoRepository;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@WebService(serviceName = "BarberoService")
public class BarberoSoapService {

    @Autowired
    private BarberoRepository barberoRepository;

    @WebMethod
    public List<Barbero> listarBarberos() {
        return barberoRepository.findAll();
    }

    @WebMethod
    public Barbero buscarBarberoPorId(@WebParam(name = "id") Integer id) {
        return barberoRepository.findById(id).orElse(null);
    }
}
