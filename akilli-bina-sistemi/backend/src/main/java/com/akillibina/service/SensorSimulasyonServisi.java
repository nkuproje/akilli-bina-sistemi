package com.akillibina.service;

import com.akillibina.entity.Bina;
import com.akillibina.entity.Daire;
import com.akillibina.entity.EnerjiOkuma;
import com.akillibina.repository.BinaRepository;
import com.akillibina.repository.EnerjiOkumaRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * IoT Sensör Simülasyon Servisi
 *
 * Gerçek bir akıllı bina sisteminde bu veriler fiziksel sensörlerden (MQTT, Modbus vb.)
 * gelirdi. Bu servis, demo ortamı için rastgele ama gerçekçi aralıklarda veri üretir.
 *
 * Zamanlama: Her gün gece 02:00'de otomatik olarak çalışır (cron).
 * Manuel tetikleme: POST /api/enerji/simule endpoint'i ile istenildiğinde çalıştırılabilir.
 */
@Service
public class SensorSimulasyonServisi {

    private final EnerjiOkumaRepository enerjiOkumaRepository;
    private final BinaRepository binaRepository;
    private final Random random = new Random();

    // Birim fiyatlar (TL)
    private static final BigDecimal ELEKTRIK_BIRIM_FIYAT  = new BigDecimal("3.50");
    private static final BigDecimal SU_BIRIM_FIYAT        = new BigDecimal("15.00");
    private static final BigDecimal DOGALGAZ_BIRIM_FIYAT  = new BigDecimal("8.00");

    public SensorSimulasyonServisi(EnerjiOkumaRepository enerjiOkumaRepository,
                                   BinaRepository binaRepository) {
        this.enerjiOkumaRepository = enerjiOkumaRepository;
        this.binaRepository = binaRepository;
    }

    /**
     * Her gün gece 02:00'de otomatik çalışır.
     * Cron ifadesi: saniye dakika saat gün-ay ay gün-hafta
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void otomatikSensorOkumasi() {
        List<Bina> binalar = binaRepository.findAll();
        for (Bina bina : binalar) {
            // Bina geneli okuma (yönetici)
            EnerjiOkuma binaOkuma = rastgeleOkumaUret(bina);
            enerjiOkumaRepository.save(binaOkuma);
            // Her daire için bireysel küçük okuma (sakin)
            for (Daire daire : bina.getDaireler()) {
                EnerjiOkuma daireOkuma = rastgeleDaireOkumaUret(bina, daire);
                enerjiOkumaRepository.save(daireOkuma);
            }
        }
    }

    /**
     * Manuel tetikleme için kullanılır.
     * @param binaId Hangi bina için simülasyon yapılacak
     * @return Üretilen okuma verisi
     */
    public EnerjiOkuma manuelSimulasyon(Long binaId) {
        Bina bina = binaRepository.findById(binaId)
                .orElseThrow(() -> new RuntimeException("Bina bulunamadı: " + binaId));
        // Bina geneli okuma
        EnerjiOkuma binaOkuma = rastgeleOkumaUret(bina);
        enerjiOkumaRepository.save(binaOkuma);
        // Daire bazlı okumalar
        for (Daire daire : bina.getDaireler()) {
            EnerjiOkuma daireOkuma = rastgeleDaireOkumaUret(bina, daire);
            enerjiOkumaRepository.save(daireOkuma);
        }
        return binaOkuma;
    }

    /**
     * Daire bazlı küçük tüketim değerleri üretir.
     * Elektrik: 150-350 kWh, Su: 8-18 m³, Doğalgaz: 3-25 m³
     */
    private EnerjiOkuma rastgeleDaireOkumaUret(Bina bina, Daire daire) {
        int ayNumarasi = java.time.LocalDate.now().getMonthValue();
        double elektrikCarpan = hesaplaElektrikCarpan(ayNumarasi);
        double suCarpan = hesaplaSuCarpan(ayNumarasi);
        double dogalgazCarpan = hesaplaDogalgazCarpan(ayNumarasi);

        // Daire bazı tüketimler (bina genelinin yaklaşık 1/20'si)
        BigDecimal elektrikKwh  = bd((150 + random.nextDouble() * 200) * elektrikCarpan);
        BigDecimal suM3         = bd((8   + random.nextDouble() * 10)  * suCarpan);
        BigDecimal dogalgazM3   = bd((3   + random.nextDouble() * 22)  * dogalgazCarpan);

        BigDecimal elektrikMaliyet  = elektrikKwh.multiply(ELEKTRIK_BIRIM_FIYAT).setScale(2, RoundingMode.HALF_UP);
        BigDecimal suMaliyet        = suM3.multiply(SU_BIRIM_FIYAT).setScale(2, RoundingMode.HALF_UP);
        BigDecimal dogalgazMaliyet  = dogalgazM3.multiply(DOGALGAZ_BIRIM_FIYAT).setScale(2, RoundingMode.HALF_UP);
        BigDecimal toplamMaliyet    = elektrikMaliyet.add(suMaliyet).add(dogalgazMaliyet);

        EnerjiOkuma okuma = new EnerjiOkuma();
        okuma.setBina(bina);
        okuma.setDaire(daire);
        okuma.setOkumaTarihi(java.time.LocalDate.now());
        okuma.setDonemAy(ayNumarasi);
        okuma.setDonemYil(java.time.LocalDate.now().getYear());
        okuma.setElektrikKwh(elektrikKwh);
        okuma.setSuM3(suM3);
        okuma.setDogalgazM3(dogalgazM3);
        okuma.setElektrikMaliyet(elektrikMaliyet);
        okuma.setSuMaliyet(suMaliyet);
        okuma.setDogalgazMaliyet(dogalgazMaliyet);
        okuma.setToplamMaliyet(toplamMaliyet);
        okuma.setTasarrufOnerisi(tasarrufOnerisiUret(elektrikKwh, suM3, dogalgazM3, ayNumarasi));
        return okuma;
    }

    /**
     * Gerçekçi rastgele sensör verisi üretir.
     *
     * Mevsimsel etki: Kış aylarında doğalgaz yüksek, yaz aylarında elektrik yüksek.
     * Su tüketimi yaz aylarında biraz daha fazla (sulama, sıcak hava).
     */
    private EnerjiOkuma rastgeleOkumaUret(Bina bina) {
        int ayNumarasi = LocalDate.now().getMonthValue();

        // Mevsimsel çarpanlar
        double elektrikCarpan  = hesaplaElektrikCarpan(ayNumarasi);
        double suCarpan        = hesaplaSuCarpan(ayNumarasi);
        double dogalgazCarpan  = hesaplaDogalgazCarpan(ayNumarasi);

        // Baz tüketimler (orta büyüklükte bir apartman için aylık)
        // Elektrik: 2000–6000 kWh
        double elektrikBaz = 2000 + random.nextDouble() * 4000;
        // Su: 60–180 m³
        double suBaz = 60 + random.nextDouble() * 120;
        // Doğalgaz: 50–400 m³  (kış: yüksek, yaz: düşük)
        double dogalgazBaz = 50 + random.nextDouble() * 350;

        BigDecimal elektrikKwh  = bd(elektrikBaz  * elektrikCarpan);
        BigDecimal suM3         = bd(suBaz        * suCarpan);
        BigDecimal dogalgazM3   = bd(dogalgazBaz  * dogalgazCarpan);

        BigDecimal elektrikMaliyet  = elektrikKwh.multiply(ELEKTRIK_BIRIM_FIYAT).setScale(2, RoundingMode.HALF_UP);
        BigDecimal suMaliyet        = suM3.multiply(SU_BIRIM_FIYAT).setScale(2, RoundingMode.HALF_UP);
        BigDecimal dogalgazMaliyet  = dogalgazM3.multiply(DOGALGAZ_BIRIM_FIYAT).setScale(2, RoundingMode.HALF_UP);
        BigDecimal toplamMaliyet    = elektrikMaliyet.add(suMaliyet).add(dogalgazMaliyet);

        EnerjiOkuma okuma = new EnerjiOkuma();
        okuma.setBina(bina);
        okuma.setOkumaTarihi(LocalDate.now());
        okuma.setDonemAy(ayNumarasi);
        okuma.setDonemYil(LocalDate.now().getYear());
        okuma.setElektrikKwh(elektrikKwh);
        okuma.setSuM3(suM3);
        okuma.setDogalgazM3(dogalgazM3);
        okuma.setElektrikMaliyet(elektrikMaliyet);
        okuma.setSuMaliyet(suMaliyet);
        okuma.setDogalgazMaliyet(dogalgazMaliyet);
        okuma.setToplamMaliyet(toplamMaliyet);
        okuma.setTasarrufOnerisi(tasarrufOnerisiUret(elektrikKwh, suM3, dogalgazM3, ayNumarasi));

        return okuma;
    }

    /**
     * Yeni daire seçimi sonrasında çağrılır.
     * Daire için hiç okuma yoksa son 6 ayın geçmiş verilerini üretir.
     */
    public void gecmisOkumaUret(Bina bina, Daire daire) {
        List<com.akillibina.entity.EnerjiOkuma> mevcutOkumalar =
            enerjiOkumaRepository.findByDaireIdOrderByOkumaTarihiDesc(daire.getId());
        if (!mevcutOkumalar.isEmpty()) return; // Zaten veri var, dokunma

        java.time.LocalDate bugun = java.time.LocalDate.now();
        // Son 6 ayın verisi (geçen aydan başlayarak geriye git)
        for (int i = 6; i >= 1; i--) {
            java.time.LocalDate donem = bugun.minusMonths(i);
            int ay = donem.getMonthValue();
            int yil = donem.getYear();
            java.time.LocalDate ayinSonGunu = donem.withDayOfMonth(donem.lengthOfMonth());

            double elektrikCarpan  = hesaplaElektrikCarpan(ay);
            double suCarpan        = hesaplaSuCarpan(ay);
            double dogalgazCarpan  = hesaplaDogalgazCarpan(ay);

            BigDecimal elektrikKwh  = bd((150 + random.nextDouble() * 200) * elektrikCarpan);
            BigDecimal suM3         = bd((8   + random.nextDouble() * 10)  * suCarpan);
            BigDecimal dogalgazM3   = bd((3   + random.nextDouble() * 22)  * dogalgazCarpan);

            BigDecimal elektrikMaliyet  = elektrikKwh.multiply(ELEKTRIK_BIRIM_FIYAT).setScale(2, java.math.RoundingMode.HALF_UP);
            BigDecimal suMaliyet        = suM3.multiply(SU_BIRIM_FIYAT).setScale(2, java.math.RoundingMode.HALF_UP);
            BigDecimal dogalgazMaliyet  = dogalgazM3.multiply(DOGALGAZ_BIRIM_FIYAT).setScale(2, java.math.RoundingMode.HALF_UP);
            BigDecimal toplamMaliyet    = elektrikMaliyet.add(suMaliyet).add(dogalgazMaliyet);

            com.akillibina.entity.EnerjiOkuma okuma = new com.akillibina.entity.EnerjiOkuma();
            okuma.setBina(bina);
            okuma.setDaire(daire);
            okuma.setOkumaTarihi(ayinSonGunu);
            okuma.setDonemAy(ay);
            okuma.setDonemYil(yil);
            okuma.setElektrikKwh(elektrikKwh);
            okuma.setSuM3(suM3);
            okuma.setDogalgazM3(dogalgazM3);
            okuma.setElektrikMaliyet(elektrikMaliyet);
            okuma.setSuMaliyet(suMaliyet);
            okuma.setDogalgazMaliyet(dogalgazMaliyet);
            okuma.setToplamMaliyet(toplamMaliyet);
            okuma.setTasarrufOnerisi(tasarrufOnerisiUret(elektrikKwh, suM3, dogalgazM3, ay));
            enerjiOkumaRepository.save(okuma);
        }
    }

    // Yaz aylarında klima nedeniyle elektrik yüksek
    private double hesaplaElektrikCarpan(int ay) {
        return switch (ay) {
            case 6, 7, 8    -> 1.3 + random.nextDouble() * 0.2;   // yaz: +30-50%
            case 12, 1, 2   -> 1.1 + random.nextDouble() * 0.1;   // kış: +10-20%
            default          -> 0.9 + random.nextDouble() * 0.2;   // ilkbahar/sonbahar
        };
    }

    // Yaz aylarında sulama vs. nedeniyle su biraz artar
    private double hesaplaSuCarpan(int ay) {
        return switch (ay) {
            case 6, 7, 8    -> 1.1 + random.nextDouble() * 0.15;
            default          -> 0.85 + random.nextDouble() * 0.3;
        };
    }

    // Kış aylarında ısınma için doğalgaz çok yüksek
    private double hesaplaDogalgazCarpan(int ay) {
        return switch (ay) {
            case 12, 1, 2   -> 2.5 + random.nextDouble() * 1.0;   // kış: 2.5-3.5x
            case 3, 11      -> 1.5 + random.nextDouble() * 0.5;   // geçiş: 1.5-2x
            case 6, 7, 8    -> 0.1 + random.nextDouble() * 0.1;   // yaz: sadece sıcak su
            default          -> 0.8 + random.nextDouble() * 0.4;
        };
    }

    private String tasarrufOnerisiUret(BigDecimal elektrik, BigDecimal su,
                                        BigDecimal dogalgaz, int ay) {
        StringBuilder sb = new StringBuilder();

        if (elektrik.compareTo(new BigDecimal("5000")) > 0) {
            sb.append("⚡ Elektrik tüketimi yüksek: LED aydınlatmaya geçiş ve klima filtresi temizliği önerilir. ");
        }
        if (su.compareTo(new BigDecimal("150")) > 0) {
            sb.append("💧 Su tüketimi ortalamanın üzerinde: Musluk ve tesisat kaçak kontrolü yapılmalıdır. ");
        }
        if (dogalgaz.compareTo(new BigDecimal("300")) > 0 && (ay == 12 || ay == 1 || ay == 2)) {
            sb.append("🔥 Doğalgaz tüketimi yüksek: Kazan bakımı ve bina yalıtımı gözden geçirilmelidir. ");
        } else if (dogalgaz.compareTo(new BigDecimal("200")) > 0 && ay >= 3 && ay <= 5) {
            sb.append("🔥 İlkbaharda doğalgaz tüketimi yüksek: Termostat ayarlarının kontrol edilmesi önerilir. ");
        }

        return sb.length() > 0 ? sb.toString().trim()
                : "✅ Tüketim değerleri normal seviyelerde. Tasarruf önerisi bulunmamaktadır.";
    }

    private BigDecimal bd(double deger) {
        return BigDecimal.valueOf(deger).setScale(2, RoundingMode.HALF_UP);
    }
}
