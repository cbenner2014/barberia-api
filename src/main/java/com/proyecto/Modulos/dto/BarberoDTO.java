package com.proyecto.Modulos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BarberoDTO {

    private Integer idBarbero;

    @NotBlank(message = "El nombre del barbero no puede estar vacío")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo puede contener letras y espacios")
    private String nombreBarbero;

    @NotNull(message = "La edad es obligatoria")
    @Min(value = 18, message = "El barbero debe ser mayor de edad (18+)")
    private Integer edadBarbero;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Debe ser un correo electrónico válido")
    private String emailBarbero;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String usuarioBarbero;

    private String contrasenaBarbero;
}
