package com.proyecto.Modulos.dto;

import com.proyecto.Modulos.entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private Rol rol;
    private Integer idBarbero;
    private Integer idCliente;
}
