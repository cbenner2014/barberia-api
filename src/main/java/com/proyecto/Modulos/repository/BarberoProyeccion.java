package com.proyecto.Modulos.repository;

public interface BarberoProyeccion {
    Integer getIdBarbero();
    String getNombreBarbero();
    Integer getEdadBarbero();
    String getEmailBarbero();
    String getUsuarioBarbero();
    // No exponemos la contrasenaBarbero en la proyección
}
