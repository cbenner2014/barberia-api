package com.proyecto.Modulos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "barbero")
@Data // Genera getters, setters, toString, etc.
@AllArgsConstructor // Constructor con todos los campos
@NoArgsConstructor  // Constructor vacío
public class Barbero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Barbero")
    private Integer idBarbero;

    @Column(name = "nombre_barbero")
    private String nombreBarbero;

    @Column(name = "edad_Barbero")
    private Integer edadBarbero;

    @Column(name = "email_barbero")
    private String emailBarbero;

    @Column(name = "usuario_barbero", unique = true)
    private String usuarioBarbero;

    @Column(name = "contrasena_barbero")
    private String contrasenaBarbero;
}