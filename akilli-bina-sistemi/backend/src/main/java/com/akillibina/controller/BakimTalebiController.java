package com.akillibina.controller;

import com.akillibina.entity.BakimTalebi;
import com.akillibina.entity.User;
import com.akillibina.repository.BakimTalebiRepository;
import com.akillibina.repository.DaireRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bakim")
public class BakimTalebiController {

    private final BakimTalebiRepository bakimTalebiRepository;
    private final DaireRepository daireRepository;

    public BakimTalebiController(BakimTalebiRepository bakimTalebiRepository, DaireRepository daireRepository) {
        this.bakimTalebiRepository = bakimTalebiRepository;
        this.daireRepository = daireRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<List<BakimTalebi>> tumTalepler() {
        return ResponseEntity.ok(bakimTalebiRepository.findAllOrderByOncelik());
    }

    @GetMapping("/benim")
    @PreAuthorize("hasRole('SAKIN')")
    public ResponseEntity<List<BakimTalebi>> beniminTaleplerim(@AuthenticationPrincipal User kullanici) {
        return ResponseEntity.ok(bakimTalebiRepository.findBySakinId(kullanici.getId()));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> talepOlustur(@RequestBody BakimTalebiRequest request, @AuthenticationPrincipal User kullanici) {
        if (kullanici.getDaire() == null) {
            return ResponseEntity.badRequest().body(Map.of("hata", "Daireye atanmamışsınız"));
        }
        BakimTalebi talep = new BakimTalebi();
        talep.setDaire(kullanici.getDaire());
        talep.setSakin(kullanici);
        talep.setBaslik(request.baslik());
        talep.setAciklama(request.aciklama());
        talep.setOncelik(BakimTalebi.OncelikSeviyesi.valueOf(request.oncelik()));
        talep.setKategori(request.kategori());
        talep.setDurum(BakimTalebi.TalepDurumu.ACIK);
        return ResponseEntity.ok(bakimTalebiRepository.save(talep));
    }

    @PutMapping("/{id}/durum")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> durumGuncelle(@PathVariable Long id, @RequestBody DurumRequest request) {
        return bakimTalebiRepository.findById(id).map(talep -> {
            talep.setDurum(BakimTalebi.TalepDurumu.valueOf(request.durum()));
            if (request.cozumNotu() != null) talep.setCozumNotu(request.cozumNotu());
            if ("COZULDU".equals(request.durum())) talep.setCozulmeTarihi(LocalDateTime.now());
            return ResponseEntity.ok(bakimTalebiRepository.save(talep));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/istatistik")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<Map<String, Object>> istatistik() {
        return ResponseEntity.ok(Map.of(
            "acik", bakimTalebiRepository.countByDurum(BakimTalebi.TalepDurumu.ACIK),
            "islemde", bakimTalebiRepository.countByDurum(BakimTalebi.TalepDurumu.ISLEME_ALINDI),
            "cozuldu", bakimTalebiRepository.countByDurum(BakimTalebi.TalepDurumu.COZULDU)
        ));
    }

    record BakimTalebiRequest(String baslik, String aciklama, String oncelik, String kategori) {}
    record DurumRequest(String durum, String cozumNotu) {}
}
