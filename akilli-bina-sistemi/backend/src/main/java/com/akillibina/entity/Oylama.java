package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "oylamalar")
public class Oylama {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String baslik;
    @Column(columnDefinition = "TEXT") private String aciklama;
    @ElementCollection
    @CollectionTable(name = "oylama_secenekler", joinColumns = @JoinColumn(name = "oylama_id"))
    @Column(name = "secenek")
    private List<String> secenekler;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "olusturan_id", nullable = false)
    @JsonIgnoreProperties({"daire", "hibernateLazyInitializer", "handler"})
    private User olusturan;
    private LocalDateTime baslangicTarihi;
    private LocalDateTime bitisTarihi;
    @Enumerated(EnumType.STRING) private OylamaDurumu durum;
    @OneToMany(mappedBy = "oylama", cascade = CascadeType.ALL, fetch = FetchType.LAZY) private List<OylamaYaniti> yanitlar;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); if (durum == null) durum = OylamaDurumu.AKTIF; }
    public enum OylamaDurumu { AKTIF, TAMAMLANDI, IPTAL_EDILDI }
    public Oylama() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBaslik() { return baslik; }
    public void setBaslik(String baslik) { this.baslik = baslik; }
    public String getAciklama() { return aciklama; }
    public void setAciklama(String aciklama) { this.aciklama = aciklama; }
    public List<String> getSecenekler() { return secenekler; }
    public void setSecenekler(List<String> secenekler) { this.secenekler = secenekler; }
    public User getOlusturan() { return olusturan; }
    public void setOlusturan(User olusturan) { this.olusturan = olusturan; }
    public LocalDateTime getBaslangicTarihi() { return baslangicTarihi; }
    public void setBaslangicTarihi(LocalDateTime baslangicTarihi) { this.baslangicTarihi = baslangicTarihi; }
    public LocalDateTime getBitisTarihi() { return bitisTarihi; }
    public void setBitisTarihi(LocalDateTime bitisTarihi) { this.bitisTarihi = bitisTarihi; }
    public OylamaDurumu getDurum() { return durum; }
    public void setDurum(OylamaDurumu durum) { this.durum = durum; }
    public List<OylamaYaniti> getYanitlar() { return yanitlar; }
    public void setYanitlar(List<OylamaYaniti> yanitlar) { this.yanitlar = yanitlar; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
