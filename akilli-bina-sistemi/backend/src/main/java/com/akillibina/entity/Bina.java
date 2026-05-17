package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "binalar")
public class Bina {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String ad;
    @Column(nullable = false) private String adres;
    private Integer katSayisi;
    private Integer toplamDaireSayisi;
    private String yoneticiAdi;
    private String yoneticiTelefon;
    @OneToMany(mappedBy = "bina", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Daire> daireler;
    @OneToMany(mappedBy = "bina", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EnerjiOkuma> enerjiOkumalari;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); }
    public Bina() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAd() { return ad; }
    public void setAd(String ad) { this.ad = ad; }
    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }
    public Integer getKatSayisi() { return katSayisi; }
    public void setKatSayisi(Integer katSayisi) { this.katSayisi = katSayisi; }
    public Integer getToplamDaireSayisi() { return toplamDaireSayisi; }
    public void setToplamDaireSayisi(Integer toplamDaireSayisi) { this.toplamDaireSayisi = toplamDaireSayisi; }
    public String getYoneticiAdi() { return yoneticiAdi; }
    public void setYoneticiAdi(String yoneticiAdi) { this.yoneticiAdi = yoneticiAdi; }
    public String getYoneticiTelefon() { return yoneticiTelefon; }
    public void setYoneticiTelefon(String yoneticiTelefon) { this.yoneticiTelefon = yoneticiTelefon; }
    public List<Daire> getDaireler() { return daireler; }
    public void setDaireler(List<Daire> daireler) { this.daireler = daireler; }
    public List<EnerjiOkuma> getEnerjiOkumalari() { return enerjiOkumalari; }
    public void setEnerjiOkumalari(List<EnerjiOkuma> enerjiOkumalari) { this.enerjiOkumalari = enerjiOkumalari; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
