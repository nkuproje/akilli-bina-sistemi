package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "enerji_okumalari")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EnerjiOkuma {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "bina_id", nullable = false)
    @JsonIgnoreProperties({"daireler", "enerjiOkumalari", "hibernateLazyInitializer", "handler"})
    private Bina bina;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daire_id")
    @JsonIgnoreProperties({"aidatlar", "bakimTalepleri", "hibernateLazyInitializer", "handler"})
    private Daire daire;
    @Column(nullable = false) private LocalDate okumaTarihi;
    private BigDecimal elektrikKwh;
    private BigDecimal suM3;
    private BigDecimal dogalgazM3;
    private BigDecimal elektrikMaliyet;
    private BigDecimal suMaliyet;
    private BigDecimal dogalgazMaliyet;
    private BigDecimal toplamMaliyet;
    private Integer donemAy;
    private Integer donemYil;
    private String tasarrufOnerisi;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() {
        olusturmaTarihi = LocalDateTime.now();
        toplamMaliyet = BigDecimal.ZERO;
        if (elektrikMaliyet != null) toplamMaliyet = toplamMaliyet.add(elektrikMaliyet);
        if (suMaliyet != null) toplamMaliyet = toplamMaliyet.add(suMaliyet);
        if (dogalgazMaliyet != null) toplamMaliyet = toplamMaliyet.add(dogalgazMaliyet);
    }
    public EnerjiOkuma() {}
    public Daire getDaire() { return daire; }
    public void setDaire(Daire daire) { this.daire = daire; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Bina getBina() { return bina; }
    public void setBina(Bina bina) { this.bina = bina; }
    public LocalDate getOkumaTarihi() { return okumaTarihi; }
    public void setOkumaTarihi(LocalDate okumaTarihi) { this.okumaTarihi = okumaTarihi; }
    @JsonProperty("elektrikKwh")
    public BigDecimal getElektrikKwh() { return elektrikKwh; }
    public void setElektrikKwh(BigDecimal elektrikKwh) { this.elektrikKwh = elektrikKwh; }
    @JsonProperty("suM3")
    public BigDecimal getSuM3() { return suM3; }
    public void setSuM3(BigDecimal suM3) { this.suM3 = suM3; }
    @JsonProperty("dogalgazM3")
    public BigDecimal getDogalgazM3() { return dogalgazM3; }
    public void setDogalgazM3(BigDecimal dogalgazM3) { this.dogalgazM3 = dogalgazM3; }
    public BigDecimal getElektrikMaliyet() { return elektrikMaliyet; }
    public void setElektrikMaliyet(BigDecimal elektrikMaliyet) { this.elektrikMaliyet = elektrikMaliyet; }
    public BigDecimal getSuMaliyet() { return suMaliyet; }
    public void setSuMaliyet(BigDecimal suMaliyet) { this.suMaliyet = suMaliyet; }
    public BigDecimal getDogalgazMaliyet() { return dogalgazMaliyet; }
    public void setDogalgazMaliyet(BigDecimal dogalgazMaliyet) { this.dogalgazMaliyet = dogalgazMaliyet; }
    public BigDecimal getToplamMaliyet() { return toplamMaliyet; }
    public void setToplamMaliyet(BigDecimal toplamMaliyet) { this.toplamMaliyet = toplamMaliyet; }
    public Integer getDonemAy() { return donemAy; }
    public void setDonemAy(Integer donemAy) { this.donemAy = donemAy; }
    public Integer getDonemYil() { return donemYil; }
    public void setDonemYil(Integer donemYil) { this.donemYil = donemYil; }
    public String getTasarrufOnerisi() { return tasarrufOnerisi; }
    public void setTasarrufOnerisi(String tasarrufOnerisi) { this.tasarrufOnerisi = tasarrufOnerisi; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
