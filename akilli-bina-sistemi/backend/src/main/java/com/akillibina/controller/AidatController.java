package com.akillibina.controller;

import com.akillibina.entity.Aidat;
import com.akillibina.entity.Daire;
import com.akillibina.entity.User;
import com.akillibina.repository.AidatRepository;
import com.akillibina.repository.DaireRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aidatlar")
public class AidatController {

    private final AidatRepository aidatRepository;
    private final DaireRepository daireRepository;

    public AidatController(AidatRepository aidatRepository, DaireRepository daireRepository) {
        this.aidatRepository = aidatRepository;
        this.daireRepository = daireRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<List<Aidat>> tumAidatlar(@RequestParam(required = false) Integer ay, @RequestParam(required = false) Integer yil) {
        if (ay != null && yil != null) return ResponseEntity.ok(aidatRepository.findByDonemAyAndDonemYil(ay, yil));
        return ResponseEntity.ok(aidatRepository.findAll());
    }

    @GetMapping("/benim")
    @PreAuthorize("hasRole('SAKIN')")
    public ResponseEntity<List<Aidat>> beniminAidatlarim(@AuthenticationPrincipal User kullanici) {
        if (kullanici.getDaire() == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(aidatRepository.findByDaireId(kullanici.getDaire().getId()));
    }

    @PostMapping("/olustur")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> aidatOlustur(@RequestBody AidatOlusturRequest request) {
        List<Daire> daireler = daireRepository.findAll();
        for (Daire daire : daireler) {
            boolean varMi = aidatRepository.findByDonemAyAndDonemYil(request.ay(), request.yil())
                .stream().anyMatch(a -> a.getDaire().getId().equals(daire.getId()));
            if (!varMi) {
                Aidat aidat = new Aidat();
                aidat.setDaire(daire);
                aidat.setTutar(request.tutar());
                aidat.setDonemAy(request.ay());
                aidat.setDonemYil(request.yil());
                aidat.setSonOdemeTarihi(LocalDate.of(request.yil(), request.ay(), request.sonGun()));
                aidat.setDurum(Aidat.AidatDurumu.BEKLIYOR);
                aidatRepository.save(aidat);
            }
        }
        return ResponseEntity.ok(Map.of("mesaj", "Aidatlar başarıyla oluşturuldu"));
    }

    @PutMapping("/{id}/ode")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<?> aidatOde(@PathVariable Long id) {
        return aidatRepository.findById(id).map(aidat -> {
            aidat.setDurum(Aidat.AidatDurumu.ODENDI);
            aidat.setOdemeTarihi(LocalDate.now());
            return ResponseEntity.ok(aidatRepository.save(aidat));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ozet")
    @PreAuthorize("hasAnyRole('UST_YONETICI', 'ORTA_YONETICI')")
    public ResponseEntity<Map<String, Object>> ozet() {
        int buYil = LocalDate.now().getYear();
        Double toplamGelir = aidatRepository.sumOdenenAidatByYil(buYil);
        Double bekleyen = aidatRepository.sumBekleyenAidat();
        Long gecikmisSayisi = aidatRepository.countGecikmisPl();
        return ResponseEntity.ok(Map.of(
            "yillikGelir", toplamGelir != null ? toplamGelir : 0,
            "bekleyenTutar", bekleyen != null ? bekleyen : 0,
            "gecikmisSayisi", gecikmisSayisi
        ));
    }

    record AidatOlusturRequest(BigDecimal tutar, int ay, int yil, int sonGun) {}
}
