package com.akillibina.controller;

import com.akillibina.entity.User;
import com.akillibina.repository.UserRepository;
import com.akillibina.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            User user = (User) auth.getPrincipal();
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "kullanici", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "adSoyad", user.getAdSoyad(),
                    "rol", user.getRol().name(),
                    "daireId", user.getDaire() != null ? user.getDaire().getId() : ""
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("hata", "Geçersiz e-posta veya şifre"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body(Map.of("hata", "Bu e-posta zaten kayıtlı"));
        }
        User yeniKullanici = new User();
        yeniKullanici.setEmail(request.email());
        yeniKullanici.setPassword(passwordEncoder.encode(request.sifre()));
        yeniKullanici.setAdSoyad(request.adSoyad());
        yeniKullanici.setTelefon(request.telefon());
        yeniKullanici.setRol(User.Rol.SAKIN);
        yeniKullanici.setAktif(true);
        userRepository.save(yeniKullanici);
        return ResponseEntity.ok(Map.of("mesaj", "Kayıt başarılı."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "adSoyad", user.getAdSoyad(),
            "rol", user.getRol().name(),
            "daireId", user.getDaire() != null ? user.getDaire().getId() : ""
        ));
    }

    @GetMapping("/hash")
    public ResponseEntity<?> getHash() {
        String hash = passwordEncoder.encode("password123");
        // Ayrıca admin şifresini güncelle
        userRepository.findByEmail("admin@atasitesi.com").ifPresent(u -> {
            u.setPassword(hash);
            userRepository.save(u);
        });
        return ResponseEntity.ok(java.util.Map.of("hash", hash, "mesaj", "Admin şifresi güncellendi"));
    }

    record LoginRequest(String email, String password) {}
    record RegisterRequest(String email, String sifre, String adSoyad, String telefon) {}
}
