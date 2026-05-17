package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "oylama_yanitlari", uniqueConstraints = @UniqueConstraint(columnNames = {"oylama_id", "kullanici_id"}))
public class OylamaYaniti {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "oylama_id", nullable = false) private Oylama oylama;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "kullanici_id", nullable = false) private User kullanici;
    @Column(nullable = false) private String secilenSecenek;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); }
    public OylamaYaniti() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Oylama getOylama() { return oylama; }
    public void setOylama(Oylama oylama) { this.oylama = oylama; }
    public User getKullanici() { return kullanici; }
    public void setKullanici(User kullanici) { this.kullanici = kullanici; }
    public String getSecilenSecenek() { return secilenSecenek; }
    public void setSecilenSecenek(String secilenSecenek) { this.secilenSecenek = secilenSecenek; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
