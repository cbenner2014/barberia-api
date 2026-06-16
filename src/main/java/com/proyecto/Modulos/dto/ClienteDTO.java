package com.proyecto.Modulos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClienteDTO {

    private Integer idCliente;

    @NotBlank(message = "El nombre del cliente no puede estar vacío")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String nombreCliente;

    @NotBlank(message = "El teléfono no puede estar vacío")
    @Size(min = 7, max = 15, message = "El teléfono debe tener entre 7 y 15 caracteres")
    private String telefonoCliente;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Debe ser un correo electrónico válido")
    private String emailCliente;
}
