package com.proyecto.Modulos.service;

import com.proyecto.Modulos.dto.LoginRequest;
import com.proyecto.Modulos.dto.LoginResponse;
import com.proyecto.Modulos.entity.Usuario;
import com.proyecto.Modulos.repository.UsuarioRepository;
import com.proyecto.Modulos.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        System.out.println("DEBUG: Intento de login para usuario: " + request.getUsername());
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            System.out.println("DEBUG: Autenticación exitosa para: " + request.getUsername());
        } catch (Exception e) {
            System.out.println("DEBUG: Fallo de autenticación para: " + request.getUsername() + " - Error: " + e.getMessage());
            throw e;
        }

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("rol", usuario.getRol().name());

        String token = jwtService.generateToken(usuario.getUsername(), extraClaims);

        return new LoginResponse(
                token,
                usuario.getUsername(),
                usuario.getRol(),
                usuario.getBarbero() != null ? usuario.getBarbero().getIdBarbero() : null,
                usuario.getCliente() != null ? usuario.getCliente().getIdCliente() : null
        );
    }

    public Usuario registrar(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }
}
