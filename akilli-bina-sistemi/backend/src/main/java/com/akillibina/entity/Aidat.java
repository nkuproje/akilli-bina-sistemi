package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "aidatlar")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Aidat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "daire_id", nullable = false)
    @JsonIgnoreProperties({"aidatlar", "bakimTalepleri", "bina", "hibernateLazyInitializer", "handler"})
    private Daire daire;
    @Column(nullable = false) private BigDecimal tutar;
    @Column(nullable = false) private Integer donemAy;
    @Column(nullable = false) private Integer donemYil;
    @Column(nullable = false) private LocalDate sonOdemeTarihi;
    private LocalDate odemeTarihi;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private AidatDurumu durum;
    private String aciklama;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); if (durum == null) durum = AidatDurumu.BEKLIYOR; }
    public enum AidatDurumu { BEKLIYOR, ODENDI, GECIKTI }
    public Aidat() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Daire getDaire() { return daire; }
    public void setDaire(Daire daire) { this.daire = daire; }
    public BigDecimal getTutar() { return tutar; }
    public void setTutar(BigDecimal tutar) { this.tutar = tutar; }
    public Integer getDonemAy() { return donemAy; }
    public void setDonemAy(Integer donemAy) { this.donemAy = donemAy; }
    public Integer getDonemYil() { return donemYil; }
    public void setDonemYil(Integer donemYil) { this.donemYil = donemYil; }
    public LocalDate getSonOdemeTarihi() { return sonOdemeTarihi; }
    public void setSonOdemeTarihi(LocalDate sonOdemeTarihi) { this.sonOdemeTarihi = sonOdemeTarihi; }
    public LocalDate getOdemeTarihi() { return odemeTarihi; }
    public void setOdemeTarihi(LocalDate odemeTarihi) { this.odemeTarihi = odemeTarihi; }
    public AidatDurumu getDurum() { return durum; }
    public void setDurum(AidatDurumu durum) { this.durum = durum; }
    public String getAciklama() { return aciklama; }
    public void setAciklama(String aciklama) { this.aciklama = aciklama; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
