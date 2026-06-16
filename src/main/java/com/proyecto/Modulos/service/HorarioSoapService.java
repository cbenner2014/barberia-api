package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Horario;
import com.proyecto.Modulos.repository.HorarioRepository;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@WebService(serviceName = "HorarioService")
public class HorarioSoapService {

    @Autowired
    private HorarioRepository horarioRepository;

    @WebMethod
    public List<Horario> listarHorarios() {
        return horarioRepository.findAll();
    }

    @WebMethod
    public Horario buscarHorarioPorId(@WebParam(name = "id") Integer id) {
        return horarioRepository.findById(id).orElse(null);
    }
}
