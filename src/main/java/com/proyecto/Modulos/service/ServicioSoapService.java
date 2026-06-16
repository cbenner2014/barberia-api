package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Servicio;
import com.proyecto.Modulos.repository.ServicioRepository;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@WebService(serviceName = "ServicioService")
public class ServicioSoapService {

    @Autowired
    private ServicioRepository servicioRepository;

    @WebMethod
    public List<Servicio> listarServicios() {
        return servicioRepository.findAll();
    }

    @WebMethod
    public Servicio buscarServicioPorId(@WebParam(name = "id") Integer id) {
        return servicioRepository.findById(id).orElse(null);
    }
}
