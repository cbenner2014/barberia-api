package com.proyecto.Modulos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Usuario")
    private Integer idUsuario;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    // Optional links to profiles
    @OneToOne
    @JoinColumn(name = "id_Barbero", nullable = true)
    private Barbero barbero;

    @OneToOne
    @JoinColumn(name = "id_Cliente", nullable = true)
    private Cliente cliente;
}
