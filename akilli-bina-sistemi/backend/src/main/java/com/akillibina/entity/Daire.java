package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "daireler")
public class Daire {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "bina_id", nullable = false)
    @JsonIgnoreProperties({"daireler", "enerjiOkumalari"})
    private Bina bina;
    @Column(nullable = false) private Integer katNo;
    @Column(nullable = false) private String daireNo;
    private BigDecimal metrekare;
    @Enumerated(EnumType.STRING) private DaireTipi tip;
    @Column(nullable = false) private boolean dolu = false;
    @OneToMany(mappedBy = "daire", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Aidat> aidatlar;
    @OneToMany(mappedBy = "daire", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BakimTalebi> bakimTalepleri;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); }
    public enum DaireTipi { KONUT, ISYERI, DEPO }
    public Daire() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Bina getBina() { return bina; }
    public void setBina(Bina bina) { this.bina = bina; }
    public Integer getKatNo() { return katNo; }
    public void setKatNo(Integer katNo) { this.katNo = katNo; }
    public String getDaireNo() { return daireNo; }
    public void setDaireNo(String daireNo) { this.daireNo = daireNo; }
    public BigDecimal getMetrekare() { return metrekare; }
    public void setMetrekare(BigDecimal metrekare) { this.metrekare = metrekare; }
    public DaireTipi getTip() { return tip; }
    public void setTip(DaireTipi tip) { this.tip = tip; }
    public boolean isDolu() { return dolu; }
    public void setDolu(boolean dolu) { this.dolu = dolu; }
    public List<Aidat> getAidatlar() { return aidatlar; }
    public void setAidatlar(List<Aidat> aidatlar) { this.aidatlar = aidatlar; }
    public List<BakimTalebi> getBakimTalepleri() { return bakimTalepleri; }
    public void setBakimTalepleri(List<BakimTalebi> bakimTalepleri) { this.bakimTalepleri = bakimTalepleri; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
}
