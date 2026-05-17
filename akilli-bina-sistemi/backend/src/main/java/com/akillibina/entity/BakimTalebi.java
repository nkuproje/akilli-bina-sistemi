package com.akillibina.entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "bakim_talepleri")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BakimTalebi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "daire_id", nullable = false)
    @JsonIgnoreProperties({"aidatlar", "bakimTalepleri", "bina", "hibernateLazyInitializer", "handler"})
    private Daire daire;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "sakin_id", nullable = false)
    @JsonIgnoreProperties({"daire", "hibernateLazyInitializer", "handler"})
    private User sakin;
    @Column(nullable = false) private String baslik;
    @Column(columnDefinition = "TEXT") private String aciklama;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private OncelikSeviyesi oncelik;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private TalepDurumu durum;
    private String kategori;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "atanan_personel_id")
    @JsonIgnoreProperties({"daire", "hibernateLazyInitializer", "handler"})
    private User atananPersonel;
    private LocalDateTime cozulmeTarihi;
    private String cozumNotu;
    @Column(updatable = false) private LocalDateTime olusturmaTarihi;
    private LocalDateTime guncellenmeTarihi;
    @PrePersist protected void onCreate() { olusturmaTarihi = LocalDateTime.now(); guncellenmeTarihi = LocalDateTime.now(); if (durum == null) durum = TalepDurumu.ACIK; if (oncelik == null) oncelik = OncelikSeviyesi.NORMAL; }
    @PreUpdate protected void onUpdate() { guncellenmeTarihi = LocalDateTime.now(); }
    public enum TalepDurumu { ACIK, ISLEME_ALINDI, COZULDU, IPTAL_EDILDI }
    public enum OncelikSeviyesi { DUSUK, NORMAL, YUKSEK, ACIL }
    public BakimTalebi() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Daire getDaire() { return daire; }
    public void setDaire(Daire daire) { this.daire = daire; }
    public User getSakin() { return sakin; }
    public void setSakin(User sakin) { this.sakin = sakin; }
    public String getBaslik() { return baslik; }
    public void setBaslik(String baslik) { this.baslik = baslik; }
    public String getAciklama() { return aciklama; }
    public void setAciklama(String aciklama) { this.aciklama = aciklama; }
    public OncelikSeviyesi getOncelik() { return oncelik; }
    public void setOncelik(OncelikSeviyesi oncelik) { this.oncelik = oncelik; }
    public TalepDurumu getDurum() { return durum; }
    public void setDurum(TalepDurumu durum) { this.durum = durum; }
    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }
    public User getAtananPersonel() { return atananPersonel; }
    public void setAtananPersonel(User atananPersonel) { this.atananPersonel = atananPersonel; }
    public LocalDateTime getCozulmeTarihi() { return cozulmeTarihi; }
    public void setCozulmeTarihi(LocalDateTime cozulmeTarihi) { this.cozulmeTarihi = cozulmeTarihi; }
    public String getCozumNotu() { return cozumNotu; }
    public void setCozumNotu(String cozumNotu) { this.cozumNotu = cozumNotu; }
    public LocalDateTime getOlusturmaTarihi() { return olusturmaTarihi; }
    public LocalDateTime getGuncellenmeTarihi() { return guncellenmeTarihi; }
}
