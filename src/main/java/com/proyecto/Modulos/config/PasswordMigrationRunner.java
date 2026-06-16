package com.proyecto.Modulos.config;

import com.proyecto.Modulos.entity.Usuario;
import com.proyecto.Modulos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigrationRunner implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        List<Usuario> usuarios = usuarioRepository.findAll();
        boolean updated = false;

        for (Usuario usuario : usuarios) {
            String password = usuario.getPassword();
            // Si la contraseña no empieza con $2a$ (el prefijo de BCrypt), asumimos que es texto plano
            if (password != null && !password.startsWith("$2a$")) {
                usuario.setPassword(passwordEncoder.encode(password));
                usuarioRepository.save(usuario);
                updated = true;
                System.out.println("Migrando contraseña a BCrypt para el usuario: " + usuario.getUsername());
            }
        }

        if (updated) {
            System.out.println("Migración de contraseñas a BCrypt completada.");
        }
    }
}
