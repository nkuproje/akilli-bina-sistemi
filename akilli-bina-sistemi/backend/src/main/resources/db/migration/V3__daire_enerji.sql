-- ============================================================
-- V3: Daire bazlı enerji tüketimi desteği
-- daire_id NULL  → bina geneli okuma (yöneticiler görür)
-- daire_id SET   → o daireye ait bireysel okuma (sakin görür)
-- ============================================================

ALTER TABLE enerji_okumalari
    ADD COLUMN daire_id BIGINT NULL AFTER bina_id,
    ADD CONSTRAINT fk_enerji_daire
        FOREIGN KEY (daire_id) REFERENCES daireler(id) ON DELETE SET NULL,
    ADD INDEX idx_enerji_daire (daire_id);

-- ============================================================
-- Daire bazlı örnek okumalar (küçük tüketim değerleri)
-- Her daire için Ocak–Mayıs 2026 verisi
-- Daireler: id 1-8 (V2 seed'den geliyor)
-- ============================================================

INSERT INTO enerji_okumalari
    (bina_id, daire_id, okuma_tarihi, elektrik_kwh, su_m3, dogalgaz_m3,
     elektrik_maliyet, su_maliyet, dogalgaz_maliyet, toplam_maliyet,
     donem_ay, donem_yil, tasarruf_onerisi)
VALUES
-- Daire 1 (2A)
(1,1,'2026-01-31',210,11,14, 735,165,112,1012, 1,2026,'Tüketim normal seviyelerde.'),
(1,1,'2026-02-28',195,10,13, 683,150,104, 937, 2,2026,'Tüketim normal seviyelerde.'),
(1,1,'2026-03-31',185, 9, 8, 648,135, 64, 847, 3,2026,'Tüketim normal seviyelerde.'),
(1,1,'2026-04-30',170, 9, 4, 595,135, 32, 762, 4,2026,'Tüketim normal seviyelerde.'),
(1,1,'2026-05-14',265,11, 9, 928,165, 72,1165, 5,2026,'⚡ Elektrik tüketimi artış gösteriyor, klima kullanımını optimize edin.'),

-- Daire 2 (2B)
(1,2,'2026-01-31',230,12,16, 805,180,128,1113, 1,2026,'🔥 Doğalgaz tüketimi yüksek, termostat ayarını düşürün.'),
(1,2,'2026-02-28',215,11,15, 753,165,120,1038, 2,2026,'Tüketim normal seviyelerde.'),
(1,2,'2026-03-31',200,10, 9, 700,150, 72, 922, 3,2026,'Tüketim normal seviyelerde.'),
(1,2,'2026-04-30',185,10, 5, 648,150, 40, 838, 4,2026,'Tüketim normal seviyelerde.'),
(1,2,'2026-05-14',280,12,10, 980,180, 80,1240, 5,2026,'⚡ Elektrik tüketimi yüksek, LED aydınlatmaya geçiş önerilir.'),

-- Daire 3 (3A)
(1,3,'2026-01-31',190,10,12, 665,150, 96, 911, 1,2026,'Tüketim normal seviyelerde.'),
(1,3,'2026-02-28',180, 9,11, 630,135, 88, 853, 2,2026,'Tüketim normal seviyelerde.'),
(1,3,'2026-03-31',170, 8, 6, 595,120, 48, 763, 3,2026,'Tüketim normal seviyelerde.'),
(1,3,'2026-04-30',160, 8, 3, 560,120, 24, 704, 4,2026,'✅ Bu ay tasarruf hedefleri tutturuldu.'),
(1,3,'2026-05-14',245,10, 8, 858,150, 64,1072, 5,2026,'Tüketim normal seviyelerde.'),

-- Daire 4 (3B)
(1,4,'2026-01-31',255,13,18, 893,195,144,1232, 1,2026,'🔥 Doğalgaz tüketimi yüksek, bina yalıtımını kontrol ettirin.'),
(1,4,'2026-02-28',240,12,17, 840,180,136,1156, 2,2026,'Tüketim yüksek seyrediyor.'),
(1,4,'2026-03-31',220,11,10, 770,165, 80,1015, 3,2026,'Tüketim normal seviyelerde.'),
(1,4,'2026-04-30',205,11, 5, 718,165, 40, 923, 4,2026,'Tüketim normal seviyelerde.'),
(1,4,'2026-05-14',310,13,12,1085,195, 96,1376, 5,2026,'⚡ Elektrik tüketimi yüksek, klima filtresi temizlenmelidir.'),

-- Daire 5 (4A)
(1,5,'2026-01-31',175, 9,11, 613,135, 88, 836, 1,2026,'Tüketim normal seviyelerde.'),
(1,5,'2026-02-28',165, 8,10, 578,120, 80, 778, 2,2026,'Tüketim normal seviyelerde.'),
(1,5,'2026-03-31',155, 8, 6, 543,120, 48, 711, 3,2026,'Tüketim normal seviyelerde.'),
(1,5,'2026-04-30',145, 8, 3, 508,120, 24, 652, 4,2026,'✅ Tasarruf hedefleri tutturuldu, tebrikler!'),
(1,5,'2026-05-14',220, 9, 7, 770,135, 56, 961, 5,2026,'Tüketim normal seviyelerde.'),

-- Daire 6 (4B)
(1,6,'2026-01-31',200,10,13, 700,150,104, 954, 1,2026,'Tüketim normal seviyelerde.'),
(1,6,'2026-02-28',190, 9,12, 665,135, 96, 896, 2,2026,'Tüketim normal seviyelerde.'),
(1,6,'2026-03-31',180, 9, 7, 630,135, 56, 821, 3,2026,'Tüketim normal seviyelerde.'),
(1,6,'2026-04-30',165, 9, 4, 578,135, 32, 745, 4,2026,'Tüketim normal seviyelerde.'),
(1,6,'2026-05-14',255,10, 9, 893,150, 72,1115, 5,2026,'Tüketim normal seviyelerde.'),

-- Daire 7 (5A - Penthouse)
(1,7,'2026-01-31',290,15,20,1015,225,160,1400, 1,2026,'🔥 Doğalgaz ve elektrik tüketimi yüksek, yalıtım kontrolü önerilir.'),
(1,7,'2026-02-28',270,14,19, 945,210,152,1307, 2,2026,'Tüketim yüksek seyrediyor.'),
(1,7,'2026-03-31',250,13,11, 875,195, 88,1158, 3,2026,'Tüketim azalmaya başladı.'),
(1,7,'2026-04-30',230,13, 6, 805,195, 48,1048, 4,2026,'Tüketim normal seviyelerde.'),
(1,7,'2026-05-14',350,15,13,1225,225,104,1554, 5,2026,'⚡ Elektrik tüketimi çok yüksek, klima ve ısıtma optimizasyonu yapın.'),

-- Daire 8 (5B - Penthouse)
(1,8,'2026-01-31',275,14,19, 963,210,152,1325, 1,2026,'🔥 Doğalgaz tüketimi yüksek.'),
(1,8,'2026-02-28',260,13,18, 910,195,144,1249, 2,2026,'Tüketim yüksek seyrediyor.'),
(1,8,'2026-03-31',240,12,10, 840,180, 80,1100, 3,2026,'Tüketim normal seviyelerde.'),
(1,8,'2026-04-30',220,12, 6, 770,180, 48, 998, 4,2026,'Tüketim normal seviyelerde.'),
(1,8,'2026-05-14',330,14,12,1155,210, 96,1461, 5,2026,'⚡ Elektrik tüketimi yüksek.');
