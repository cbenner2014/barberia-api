package com.proyecto.Modulos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ServicioDTO {

    private Integer idServicio;

    @NotBlank(message = "El nombre del servicio no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombreServicio;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private Double precioServicio;

    @NotNull(message = "La duración es obligatoria")
    @Min(value = 1, message = "La duración debe ser de al menos 1 minuto")
    private Integer duracionServicio;
}
