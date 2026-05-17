package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "duyurular")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Duyuru {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String baslik;
    @Column(nullable = false, columnDefinition = "TEXT") private String icerik;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "olusturan_id", nullable = false)
    @JsonIgnoreProperties({"daire", "hibernateLazyInitializer", "handler"})
    private User olusturan;
    private boolean onemli = false;
    private boolean aktif = true;
    private LocalDateTime yayinTarihi;
    private LocalDateTime bitisTarihi;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); if (yayinTarihi == null) yayinTarihi = LocalDateTime.now(); }
    public Duyuru() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBaslik() { return baslik; }
    public void setBaslik(String baslik) { this.baslik = baslik; }
    public String getIcerik() { return icerik; }
    public void setIcerik(String icerik) { this.icerik = icerik; }
    public User getOlusturan() { return olusturan; }
    public void setOlusturan(User olusturan) { this.olusturan = olusturan; }
    public boolean isOnemli() { return onemli; }
    public void setOnemli(boolean onemli) { this.onemli = onemli; }
    public boolean isAktif() { return aktif; }
    public void setAktif(boolean aktif) { this.aktif = aktif; }
    public LocalDateTime getYayinTarihi() { return yayinTarihi; }
    public void setYayinTarihi(LocalDateTime yayinTarihi) { this.yayinTarihi = yayinTarihi; }
    public LocalDateTime getBitisTarihi() { return bitisTarihi; }
    public void setBitisTarihi(LocalDateTime bitisTarihi) { this.bitisTarihi = bitisTarihi; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
