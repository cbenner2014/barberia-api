package com.proyecto.Modulos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "servicio")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Servicio")
    private Integer idServicio;

    @Column(name = "nombre_servicio")
    private String nombreServicio;

    @Column(name = "precio_servicio")
    private Double precioServicio;

    @Column(name = "duracion_Servicio")
    private Integer duracionServicio;
}