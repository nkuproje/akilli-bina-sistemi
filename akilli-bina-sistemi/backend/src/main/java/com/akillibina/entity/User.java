package com.akillibina.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String adSoyad;

    private String telefon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "daire_id")
    @JsonIgnoreProperties({"aidatlar", "bakimTalepleri", "hibernateLazyInitializer", "handler"})
    private Daire daire;

    @Column(nullable = false)
    private boolean aktif = true;

    @Column(updatable = false)
    private LocalDateTime olusturmaTarihi;

    private LocalDateTime guncellenmeTarihi;

    public User() {}

    public User(Long id, String email, String password, String adSoyad, String telefon, Rol rol, Daire daire, boolean aktif, LocalDateTime olusturmaTarihi, LocalDateTime guncellenmeTarihi) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.adSoyad = adSoyad;
        this.telefon = telefon;
        this.rol = rol;
        this.daire = daire;
        this.aktif = aktif;
        this.olusturmaTarihi = olusturmaTarihi;
        this.guncellenmeTarihi = guncellenmeTarihi;
    }

    @PrePersist
    protected void onCreate() {
        olusturmaTarihi = LocalDateTime.now();
        guncellenmeTarihi = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        guncellenmeTarihi = LocalDateTime.now();
    }

    public enum Rol {
        UST_YONETICI,
        ORTA_YONETICI,
        SAKIN
    }

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getAdSoyad() { return adSoyad; }
    public String getTelefon() { return telefon; }
    public Rol getRol() { return rol; }
    public Daire getDaire() { return daire; }
    public boolean isAktif() { return aktif; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
    public LocalDateTime getGuncellenmeTarihi() { return guncellenmeTarihi; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setAdSoyad(String adSoyad) { this.adSoyad = adSoyad; }
    public void setTelefon(String telefon) { this.telefon = telefon; }
    public void setRol(Rol rol) { this.rol = rol; }
    public void setDaire(Daire daire) { this.daire = daire; }
    public void setAktif(boolean aktif) { this.aktif = aktif; }
    public void setOlusturmaTarihi(LocalDateTime olusturmaTarihi) { this.olusturmaTarihi = olusturmaTarihi; }
    public void setGuncellenmeTarihi(LocalDateTime guncellenmeTarihi) { this.guncellenmeTarihi = guncellenmeTarihi; }

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return aktif; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return aktif; }
}
