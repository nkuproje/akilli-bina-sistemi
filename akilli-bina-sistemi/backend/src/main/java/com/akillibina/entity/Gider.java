package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "giderler")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Gider {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "bina_id", nullable = false)
    @JsonIgnoreProperties({"daireler", "enerjiOkumalari", "hibernateLazyInitializer", "handler"})
    private Bina bina;
    @Column(nullable = false) private String kategori;
    @Column(nullable = false) private String aciklama;
    @Column(nullable = false) private BigDecimal tutar;
    @Column(nullable = false) private LocalDate giderTarihi;
    private String tedarikci;
    private String faturaNu;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "olusturan_id")
    @JsonIgnoreProperties({"daire", "hibernateLazyInitializer", "handler"})
    private User olusturan;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); }
    public Gider() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Bina getBina() { return bina; }
    public void setBina(Bina bina) { this.bina = bina; }
    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }
    public String getAciklama() { return aciklama; }
    public void setAciklama(String aciklama) { this.aciklama = aciklama; }
    public BigDecimal getTutar() { return tutar; }
    public void setTutar(BigDecimal tutar) { this.tutar = tutar; }
    public LocalDate getGiderTarihi() { return giderTarihi; }
    public void setGiderTarihi(LocalDate giderTarihi) { this.giderTarihi = giderTarihi; }
    public String getTedarikci() { return tedarikci; }
    public void setTedarikci(String tedarikci) { this.tedarikci = tedarikci; }
    public String getFaturaNu() { return faturaNu; }
    public void setFaturaNu(String faturaNu) { this.faturaNu = faturaNu; }
    public User getOlusturan() { return olusturan; }
    public void setOlusturan(User olusturan) { this.olusturan = olusturan; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
