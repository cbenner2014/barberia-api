package com.proyecto.Modulos.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cita")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Cita")
    private Integer idCita;

    private LocalDate fecha;
    private LocalTime hora;

    @Enumerated(EnumType.STRING)
    private EstadoCita estado;

    @Column(name = "estado_pago")
    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago;

    @ManyToOne
    @JoinColumn(name = "id_Cliente")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_Servicio")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "id_Barbero")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Barbero barbero;
}