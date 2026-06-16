package com.proyecto.Modulos.config;

import com.proyecto.Modulos.service.ClienteSoapService;
import jakarta.xml.ws.Endpoint;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SoapConfig {

    @Autowired
    private Bus bus;

    @Autowired
    private ClienteSoapService clienteSoapService;

    @Autowired
    private com.proyecto.Modulos.service.BarberoSoapService barberoSoapService;

    @Bean
    public Endpoint endpointCliente() {
        EndpointImpl endpoint = new EndpointImpl(bus, clienteSoapService);
        endpoint.publish("/ClienteService");
        return endpoint;
    }

    @Bean
    public Endpoint endpointBarbero() {
        EndpointImpl endpoint = new EndpointImpl(bus, barberoSoapService);
        endpoint.publish("/BarberoService");
        return endpoint;
    }

    @Autowired
    private com.proyecto.Modulos.service.ServicioSoapService servicioSoapService;

    @Bean
    public Endpoint endpointServicio() {
        EndpointImpl endpoint = new EndpointImpl(bus, servicioSoapService);
        endpoint.publish("/ServicioService");
        return endpoint;
    }

    @Autowired
    private com.proyecto.Modulos.service.HorarioSoapService horarioSoapService;

    @Bean
    public Endpoint endpointHorario() {
        EndpointImpl endpoint = new EndpointImpl(bus, horarioSoapService);
        endpoint.publish("/HorarioService");
        return endpoint;
    }

    @Autowired
    private com.proyecto.Modulos.service.CitaSoapService citaSoapService;

    @Bean
    public Endpoint endpointCita() {
        EndpointImpl endpoint = new EndpointImpl(bus, citaSoapService);
        endpoint.publish("/CitaService");
        return endpoint;
    }
}
