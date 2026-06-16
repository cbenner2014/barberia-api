package com.proyecto.Modulos.service;

import com.proyecto.Modulos.entity.Cliente;
import com.proyecto.Modulos.repository.ClienteRepository;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@WebService(serviceName = "ClienteService")
public class ClienteSoapService {

    @Autowired
    private ClienteRepository clienteRepository;

    @WebMethod
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @WebMethod
    public Cliente buscarClientePorId(@WebParam(name = "id") Integer id) {
        return clienteRepository.findById(id).orElse(null);
    }
}
