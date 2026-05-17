package com.akillibina.controller;

import com.akillibina.entity.*;
import com.akillibina.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.akillibina.service.SensorSimulasyonServisi;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/duyurular")
class DuyuruController {
    private final DuyuruRepository duyuruRepository;
    public DuyuruController(DuyuruRepository duyuruRepository) { this.duyuruRepository = duyuruRepository; }

    @GetMapping
    public ResponseEntity<List<Duyuru>> tumDuyurular() {
        return ResponseEntity.ok(duyuruRepository.findByAktifTrueOrderByOlusturmaTarihiDesc());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> duyuruOlustur(@RequestBody DuyuruRequest request, @AuthenticationPrincipal User kullanici) {
        Duyuru duyuru = new Duyuru();
        duyuru.setBaslik(request.baslik());
        duyuru.setIcerik(request.icerik());
        duyuru.setOlusturan(kullanici);
        duyuru.setOnemli(request.onemli());
        duyuru.setAktif(true);
        return ResponseEntity.ok(duyuruRepository.save(duyuru));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> duyuruSil(@PathVariable Long id) {
        return duyuruRepository.findById(id).map(d -> {
            d.setAktif(false);
            duyuruRepository.save(d);
            return ResponseEntity.ok(Map.of("mesaj", "Duyuru silindi"));
        }).orElse(ResponseEntity.notFound().build());
    }
    record DuyuruRequest(String baslik, String icerik, boolean onemli) {}
}

@RestController
@RequestMapping("/api/enerji")
class EnerjiOkumaController {
    private final EnerjiOkumaRepository enerjiOkumaRepository;
    private final BinaRepository binaRepository;
    private final SensorSimulasyonServisi sensorSimulasyonServisi;

    public EnerjiOkumaController(EnerjiOkumaRepository enerjiOkumaRepository,
                                  BinaRepository binaRepository,
                                  SensorSimulasyonServisi sensorSimulasyonServisi) {
        this.enerjiOkumaRepository = enerjiOkumaRepository;
        this.binaRepository = binaRepository;
        this.sensorSimulasyonServisi = sensorSimulasyonServisi;
    }

    /**
     * Okuma listesi — role göre veri filtreler.
     * Entity yerine Map döndürüyoruz: Jackson'ın getSuM3()/getDogalgazM3()
     * getter-naming quirk'ünü bypass etmek için alan adlarını elle yazıyoruz.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> tumOkumalar(
            @RequestParam(defaultValue = "1") Long binaId,
            @AuthenticationPrincipal User aktifKullanici) {
        List<EnerjiOkuma> liste;
        if (aktifKullanici.getRol() == User.Rol.SAKIN && aktifKullanici.getDaire() != null) {
            liste = enerjiOkumaRepository.findByDaireIdOrderByOkumaTarihiDesc(
                    aktifKullanici.getDaire().getId());
        } else {
            liste = enerjiOkumaRepository.findByBinaIdAndDaireIsNullOrderByOkumaTarihiDesc(binaId);
        }
        return ResponseEntity.ok(liste.stream().map(this::toMap).collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/yillik/{yil}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> yillikOkumalar(
            @RequestParam(defaultValue = "1") Long binaId,
            @PathVariable Integer yil,
            @AuthenticationPrincipal User aktifKullanici) {
        List<EnerjiOkuma> liste;
        if (aktifKullanici.getRol() == User.Rol.SAKIN && aktifKullanici.getDaire() != null) {
            liste = enerjiOkumaRepository.findByDaireIdAndDonemYil(
                    aktifKullanici.getDaire().getId(), yil);
        } else {
            liste = enerjiOkumaRepository.findByBinaIdAndDonemYil(binaId, yil);
        }
        return ResponseEntity.ok(liste.stream().map(this::toMap).collect(java.util.stream.Collectors.toList()));
    }

    /** Explicit alan isimleriyle Map'e çevirir — Jackson getter-naming sorununu önler */
    private Map<String, Object> toMap(EnerjiOkuma o) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",               o.getId());
        m.put("okumaTarihi",      o.getOkumaTarihi());
        m.put("donemAy",          o.getDonemAy());
        m.put("donemYil",         o.getDonemYil());
        m.put("elektrikKwh",      o.getElektrikKwh());
        m.put("suM3",             o.getSuM3());          // Explicit key — Jackson bypass
        m.put("dogalgazM3",       o.getDogalgazM3());    // Explicit key — Jackson bypass
        m.put("elektrikMaliyet",  o.getElektrikMaliyet());
        m.put("suMaliyet",        o.getSuMaliyet());
        m.put("dogalgazMaliyet",  o.getDogalgazMaliyet());
        m.put("toplamMaliyet",    o.getToplamMaliyet());
        m.put("tasarrufOnerisi",  o.getTasarrufOnerisi());
        return m;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> okumaEkle(@RequestBody EnerjiOkumaRequest request) {
        Bina bina = binaRepository.findById(request.binaId()).orElseThrow(() -> new RuntimeException("Bina bulunamadı"));
        BigDecimal elektrikMaliyet = request.elektrikKwh().multiply(new BigDecimal("3.5"));
        BigDecimal suMaliyet = request.suM3().multiply(new BigDecimal("15"));
        BigDecimal dogalgazMaliyet = request.dogalgazM3().multiply(new BigDecimal("8"));
        EnerjiOkuma okuma = new EnerjiOkuma();
        okuma.setBina(bina);
        okuma.setOkumaTarihi(LocalDate.now());
        okuma.setElektrikKwh(request.elektrikKwh());
        okuma.setSuM3(request.suM3());
        okuma.setDogalgazM3(request.dogalgazM3());
        okuma.setElektrikMaliyet(elektrikMaliyet);
        okuma.setSuMaliyet(suMaliyet);
        okuma.setDogalgazMaliyet(dogalgazMaliyet);
        okuma.setToplamMaliyet(elektrikMaliyet.add(suMaliyet).add(dogalgazMaliyet));
        okuma.setDonemAy(request.ay());
        okuma.setDonemYil(request.yil());
        okuma.setTasarrufOnerisi(request.elektrikKwh().compareTo(new BigDecimal("5000")) > 0 ? "LED ampul kullanımına geçilmesi önerilir." : "Enerji tüketimi normal seviyelerde.");
        return ResponseEntity.ok(toMap(enerjiOkumaRepository.save(okuma)));
    }
    record EnerjiOkumaRequest(Long binaId, BigDecimal elektrikKwh, BigDecimal suM3, BigDecimal dogalgazM3, int ay, int yil) {}

    /**
     * Sensör simülasyonu — rastgele gerçekçi enerji verisi üretir ve kaydeder.
     * POST /api/enerji/simule?binaId=1
     */
    @PostMapping("/simule")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> simulasyon(@RequestParam(defaultValue = "1") Long binaId) {
        try {
            EnerjiOkuma okuma = sensorSimulasyonServisi.manuelSimulasyon(binaId);
            return ResponseEntity.ok(Map.of(
                "mesaj", "Sensör verisi başarıyla üretildi",
                "okuma", toMap(okuma)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("hata", e.getMessage()));
        }
    }
}

@RestController
@RequestMapping("/api/oylamalar")
class OylamaController {
    private final OylamaRepository oylamaRepository;
    private final OylamaYanitiRepository oylamaYanitiRepository;
    public OylamaController(OylamaRepository oylamaRepository, OylamaYanitiRepository oylamaYanitiRepository) {
        this.oylamaRepository = oylamaRepository;
        this.oylamaYanitiRepository = oylamaYanitiRepository;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> tumOylamalar(@AuthenticationPrincipal User kullanici) {
        List<Oylama> oylamalar = oylamaRepository.findAllByOrderByOlusturmaTarihiDesc();
        List<Map<String, Object>> result = oylamalar.stream().map(o -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", o.getId());
            map.put("baslik", o.getBaslik());
            map.put("aciklama", o.getAciklama());
            map.put("durum", o.getDurum());
            // Her seçenek için oy sayısını hesapla ve obje olarak döndür
            List<Map<String, Object>> seceneklerWithCounts = o.getSecenekler().stream().map(s -> {
                Map<String, Object> sec = new LinkedHashMap<>();
                sec.put("ad", s);
                sec.put("oySayisi", oylamaYanitiRepository.countByOylamaIdAndSecilenSecenek(o.getId(), s));
                return sec;
            }).collect(java.util.stream.Collectors.toList());
            map.put("secenekler", seceneklerWithCounts);
            // Giriş yapan kullanıcının bu oylamada oy kullanıp kullanmadığı
            map.put("kullaniciOyKullandimi", oylamaYanitiRepository.existsByOylamaIdAndKullaniciId(o.getId(), kullanici.getId()));
            // Kullandıysa hangi seçeneği seçtiği
            oylamaYanitiRepository.findByOylamaIdAndKullaniciId(o.getId(), kullanici.getId())
                .ifPresent(yanit -> map.put("kullaniciSecenegi", yanit.getSecilenSecenek()));
            map.put("olusturmaTarihi", o.getOlusturmaTarihi());
            return map;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> oylamaOlustur(@RequestBody OylamaRequest request, @AuthenticationPrincipal User kullanici) {
        try {
            Oylama oylama = new Oylama();
            oylama.setBaslik(request.baslik());
            oylama.setAciklama(request.aciklama());
            oylama.setSecenekler(request.secenekler() != null ? request.secenekler() : new java.util.ArrayList<>());
            oylama.setOlusturan(kullanici);
            oylama.setDurum(Oylama.OylamaDurumu.AKTIF);
            Oylama saved = oylamaRepository.save(oylama);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("hata", e.getMessage()));
        }
    }

    @PostMapping("/{id}/oy-ver")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> oyVer(@PathVariable Long id, @RequestBody OyVerRequest request, @AuthenticationPrincipal User kullanici) {
        if (oylamaYanitiRepository.existsByOylamaIdAndKullaniciId(id, kullanici.getId())) {
            return ResponseEntity.badRequest().body(Map.of("hata", "Zaten oy kullandınız"));
        }
        Oylama oylama = oylamaRepository.findById(id).orElseThrow(() -> new RuntimeException("Oylama bulunamadı"));
        OylamaYaniti yanit = new OylamaYaniti();
        yanit.setOylama(oylama);
        yanit.setKullanici(kullanici);
        yanit.setSecilenSecenek(request.secenek());
        oylamaYanitiRepository.save(yanit);
        return ResponseEntity.ok(Map.of("mesaj", "Oyunuz kaydedildi"));
    }

    @GetMapping("/{id}/sonuclar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> sonuclar(@PathVariable Long id) {
        Oylama oylama = oylamaRepository.findById(id).orElseThrow(() -> new RuntimeException("Oylama bulunamadı"));
        Map<String, Long> sonuclar = new LinkedHashMap<>();
        for (String secenek : oylama.getSecenekler()) {
            sonuclar.put(secenek, oylamaYanitiRepository.countByOylamaIdAndSecilenSecenek(id, secenek));
        }
        return ResponseEntity.ok(sonuclar);
    }
    record OylamaRequest(String baslik, String aciklama, List<String> secenekler) {}
    record OyVerRequest(String secenek) {}
}

@RestController
@RequestMapping("/api/giderler")
class GiderController {
    private final GiderRepository giderRepository;
    private final BinaRepository binaRepository;
    public GiderController(GiderRepository giderRepository, BinaRepository binaRepository) {
        this.giderRepository = giderRepository;
        this.binaRepository = binaRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<List<Gider>> tumGiderler(@RequestParam(defaultValue = "1") Long binaId) {
        return ResponseEntity.ok(giderRepository.findByBinaIdOrderByGiderTarihiDesc(binaId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> giderEkle(@RequestBody GiderRequest request, @AuthenticationPrincipal User kullanici) {
        Bina bina = binaRepository.findById(request.binaId()).orElseThrow(() -> new RuntimeException("Bina bulunamadı"));
        Gider gider = new Gider();
        gider.setBina(bina);
        gider.setKategori(request.kategori());
        gider.setAciklama(request.aciklama());
        gider.setTutar(request.tutar());
        gider.setGiderTarihi(LocalDate.parse(request.tarih()));
        gider.setTedarikci(request.tedarikci());
        gider.setFaturaNu(request.faturaNu());
        gider.setOlusturan(kullanici);
        return ResponseEntity.ok(giderRepository.save(gider));
    }

    @GetMapping("/ozet/{yil}")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<Map<String, Object>> ozet(@PathVariable Integer yil) {
        Double toplamGider = giderRepository.sumByYil(yil);
        List<Object[]> kategoriOzeti = giderRepository.sumByKategoriAndYil(yil);
        Map<String, Double> kategoriMap = new LinkedHashMap<>();
        for (Object[] row : kategoriOzeti) {
            kategoriMap.put((String) row[0], ((Number) row[1]).doubleValue());
        }
        return ResponseEntity.ok(Map.of("toplamGider", toplamGider != null ? toplamGider : 0, "kategoriOzeti", kategoriMap));
    }
    record GiderRequest(Long binaId, String kategori, String aciklama, BigDecimal tutar, String tarih, String tedarikci, String faturaNu) {}
}

// ====== DAİRE SEÇİMİ VE KULLANİCI YÖNETİMİ ======

@RestController
@RequestMapping("/api/daireler")
class DaireController {
    private final DaireRepository daireRepository;

    public DaireController(DaireRepository daireRepository) {
        this.daireRepository = daireRepository;
    }

    /** Tüm daireleri listeler — dropdown için kullanılır */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> tumDaireler() {
        List<Daire> daireler = daireRepository.findAll();
        List<Map<String, Object>> result = daireler.stream()
            .sorted(java.util.Comparator.comparingInt(Daire::getKatNo)
                .thenComparing(Daire::getDaireNo))
            .map(d -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", d.getId());
                m.put("daireNo", d.getDaireNo());
                m.put("katNo", d.getKatNo());
                m.put("tip", d.getTip() != null ? d.getTip().name() : "KONUT");
                m.put("dolu", d.isDolu());
                String etiket = "Kat " + d.getKatNo() + " - Daire " + d.getDaireNo();
                if (d.getMetrekare() != null) etiket += " (" + d.getMetrekare().intValue() + " m²)";
                m.put("etiket", etiket);
                return m;
            }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }
}

@RestController
@RequestMapping("/api/kullanicilar")
class KullaniciController {
    private final UserRepository userRepository;
    private final DaireRepository daireRepository;
    private final com.akillibina.service.SensorSimulasyonServisi sensorSimulasyonServisi;
    private final com.akillibina.repository.BinaRepository binaRepository;

    public KullaniciController(UserRepository userRepository,
                                DaireRepository daireRepository,
                                com.akillibina.service.SensorSimulasyonServisi sensorSimulasyonServisi,
                                com.akillibina.repository.BinaRepository binaRepository) {
        this.userRepository = userRepository;
        this.daireRepository = daireRepository;
        this.sensorSimulasyonServisi = sensorSimulasyonServisi;
        this.binaRepository = binaRepository;
    }

    /**
     * Giriş yapan sakin kendi dairesini seçer/günceller.
     * PUT /api/kullanicilar/benim/daire  { "daireId": 3 }
     * daireId null gönderilirse daire bağlantısı kaldırılır.
     */
    @PutMapping("/benim/daire")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> daireGuncelle(
            @AuthenticationPrincipal User aktifKullanici,
            @RequestBody Map<String, Object> body) {
        User kullanici = userRepository.findById(aktifKullanici.getId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Object daireIdObj = body.get("daireId");
        if (daireIdObj == null || daireIdObj.toString().isBlank()) {
            // Daire bağlantısını kaldır
            if (kullanici.getDaire() != null) {
                Daire eskiDaire = daireRepository.findById(kullanici.getDaire().getId()).orElse(null);
                if (eskiDaire != null) { eskiDaire.setDolu(false); daireRepository.save(eskiDaire); }
            }
            kullanici.setDaire(null);
            userRepository.save(kullanici);
            return ResponseEntity.ok(Map.of("mesaj", "Daire bilgisi kaldırıldı"));
        }

        Long daireId = Long.parseLong(daireIdObj.toString());
        Daire yeniDaire = daireRepository.findById(daireId)
                .orElseThrow(() -> new RuntimeException("Daire bulunamadı: " + daireId));

        // Eski daireyi boşalt
        if (kullanici.getDaire() != null && !kullanici.getDaire().getId().equals(daireId)) {
            Daire eskiDaire = daireRepository.findById(kullanici.getDaire().getId()).orElse(null);
            if (eskiDaire != null) { eskiDaire.setDolu(false); daireRepository.save(eskiDaire); }
        }

        // Yeni daireye taşı
        yeniDaire.setDolu(true);
        daireRepository.save(yeniDaire);
        kullanici.setDaire(yeniDaire);
        userRepository.save(kullanici);

        // Daire için hiç enerji okuma yoksa geçmiş 6 ay veri üret
        try {
            com.akillibina.entity.Bina bina = yeniDaire.getBina();
            if (bina == null) {
                bina = binaRepository.findAll().stream().findFirst().orElse(null);
            }
            if (bina != null) {
                sensorSimulasyonServisi.gecmisOkumaUret(bina, yeniDaire);
            }
        } catch (Exception e) {
            // Geçmiş veri üretimi başarısız olsa bile daire ataması tamamlandı
        }

        return ResponseEntity.ok(Map.of(
            "mesaj", "Daire güncellendi",
            "daireId", yeniDaire.getId(),
            "daireNo", yeniDaire.getDaireNo(),
            "katNo", yeniDaire.getKatNo()
        ));
    }

    /**
     * Sakin listesi — yöneticiler için: ad soyad, daire bilgisi, iletişim.
     * GET /api/kullanicilar/sakinler
     */
    @GetMapping("/sakinler")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<List<Map<String, Object>>> sakinListesi() {
        List<User> sakinler = userRepository.findByRol(User.Rol.SAKIN);
        List<Map<String, Object>> result = sakinler.stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("adSoyad", u.getAdSoyad());
            m.put("email", u.getEmail());
            m.put("telefon", u.getTelefon());
            m.put("aktif", u.isAktif());
            if (u.getDaire() != null) {
                Map<String, Object> d = new LinkedHashMap<>();
                d.put("id", u.getDaire().getId());
                d.put("daireNo", u.getDaire().getDaireNo());
                d.put("katNo", u.getDaire().getKatNo());
                d.put("etiket", "Kat " + u.getDaire().getKatNo() + " - Daire " + u.getDaire().getDaireNo());
                m.put("daire", d);
            } else {
                m.put("daire", null);
            }
            return m;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }
}

// ====== GEÇMİŞ VERİ BOOTSTRAP ======
// Mevcut kullanıcıların daireleri için geçmiş veri eksikse otomatik üretir

@RestController
@RequestMapping("/api/admin")
class AdminBootstrapController {
    private final com.akillibina.repository.UserRepository userRepo;
    private final com.akillibina.repository.BinaRepository binaRepo;
    private final com.akillibina.service.SensorSimulasyonServisi simServis;

    public AdminBootstrapController(
            com.akillibina.repository.UserRepository userRepo,
            com.akillibina.repository.BinaRepository binaRepo,
            com.akillibina.service.SensorSimulasyonServisi simServis) {
        this.userRepo = userRepo;
        this.binaRepo = binaRepo;
        this.simServis = simServis;
    }

    /**
     * Dairesi olan tüm sakinler için geçmiş enerji verisi yoksa üretir.
     * POST /api/admin/gecmis-veri-uret
     */
    @PostMapping("/gecmis-veri-uret")
    @PreAuthorize("hasRole('UST_YONETICI')")
    public ResponseEntity<?> gecmisVeriUret() {
        List<com.akillibina.entity.User> sakinler =
            userRepo.findByRol(com.akillibina.entity.User.Rol.SAKIN);
        com.akillibina.entity.Bina bina = binaRepo.findAll().stream().findFirst().orElse(null);
        if (bina == null) return ResponseEntity.badRequest().body(Map.of("hata", "Bina bulunamadı"));

        int uretilen = 0;
        for (com.akillibina.entity.User sakin : sakinler) {
            if (sakin.getDaire() != null) {
                simServis.gecmisOkumaUret(bina, sakin.getDaire());
                uretilen++;
            }
        }
        return ResponseEntity.ok(Map.of("mesaj", uretilen + " daire için geçmiş veri kontrol edildi/üretildi"));
    }
}
