-- V2: Örnek veri ekleme (Seed Data)
-- Şifreler: BCrypt ile hashlenmiş "password123"

-- ============================================================
-- BİNA EKLEMELERİ
-- ============================================================
INSERT INTO binalar (ad, adres, kat_sayisi, toplam_daire_sayisi, yonetici_adi, yonetici_telefon)
VALUES
('Ata Sitesi A Blok', 'Ahmet Yesevi Cad. No:15, Çorlu / Tekirdağ', 8, 32, 'Umut Berk Savi', '0532 111 2233'),
('Ata Sitesi B Blok', 'Ahmet Yesevi Cad. No:15, Çorlu / Tekirdağ', 8, 32, 'Umut Berk Savi', '0532 111 2233');

-- ============================================================
-- DAİRE EKLEMELERİ (A Blok için örnek)
-- ============================================================
INSERT INTO daireler (bina_id, kat_no, daire_no, metrekare, tip, dolu)
VALUES
(1, 1, '1A', 90.00, 'KONUT', 1),
(1, 1, '1B', 85.00, 'KONUT', 1),
(1, 1, '1C', 95.00, 'KONUT', 1),
(1, 2, '2A', 90.00, 'KONUT', 1),
(1, 2, '2B', 85.00, 'KONUT', 1),
(1, 2, '2C', 95.00, 'KONUT', 0),
(1, 3, '3A', 90.00, 'KONUT', 1),
(1, 3, '3B', 85.00, 'KONUT', 0),
(1, 4, '4A', 110.00, 'KONUT', 1),
(1, 4, '4B', 110.00, 'KONUT', 1);

-- ============================================================
-- KULLANICI EKLEMELERİ
-- Şifre: password123 (BCrypt hash)
-- ============================================================
INSERT INTO users (email, password, ad_soyad, telefon, rol, daire_id, aktif)
VALUES
-- Üst Düzey Yönetici
('admin@atasitesi.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'Umut Berk Savi', '0532 111 2233', 'UST_YONETICI', NULL, 1),

-- Orta Düzey Yönetici
('yonetici@atasitesi.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'Hayrettin Enes Ata', '0533 222 3344', 'ORTA_YONETICI', NULL, 1),

-- Sakinler
('sakin1@mail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'Ali Demir', '0535 333 4455', 'SAKIN', 1, 1),

('sakin2@mail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'Fatma Şahin', '0536 444 5566', 'SAKIN', 2, 1),

('sakin3@mail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'Mustafa Arslan', '0537 555 6677', 'SAKIN', 4, 1);

-- ============================================================
-- DUYURU EKLEMELERİ
-- ============================================================
INSERT INTO duyurular (baslik, icerik, olusturan_id, onemli, aktif, yayin_tarihi)
VALUES
('Mayıs Ayı Aidat Hatırlatması',
 'Sayın sakinlerimiz, Mayıs 2026 dönemi aidatlarının son ödeme tarihi 25 Mayıs 2026''dur. Zamanında ödeme yapmanızı rica ederiz.',
 1, 1, 1, NOW()),

('Asansör Bakım Çalışması',
 '12 Mayıs 2026 Pazartesi günü saat 09:00-12:00 arasında A Blok asansörü bakıma alınacaktır. Bu süre zarfında asansör kullanılamayacaktır.',
 2, 1, 1, NOW()),

('Ortak Alan Temizlik Programı',
 'Her Cuma sabahı 08:00-10:00 saatleri arasında bina girişi ve merdivenler temizlenmektedir. Bu saatlerde rahatsızlık verdiğimiz için özür dileriz.',
 2, 0, 1, NOW());

-- ============================================================
-- ÖRNEK AİDAT EKLEMELERİ
-- ============================================================
INSERT INTO aidatlar (daire_id, tutar, donem_ay, donem_yil, son_odeme_tarihi, durum)
VALUES
-- Mart 2026
(1, 750.00, 3, 2026, '2026-03-25', 'ODENDI'),
(2, 750.00, 3, 2026, '2026-03-25', 'ODENDI'),
(3, 750.00, 3, 2026, '2026-03-25', 'GECIKTI'),
(4, 750.00, 3, 2026, '2026-03-25', 'ODENDI'),
(5, 750.00, 3, 2026, '2026-03-25', 'ODENDI'),
-- Nisan 2026
(1, 750.00, 4, 2026, '2026-04-25', 'ODENDI'),
(2, 750.00, 4, 2026, '2026-04-25', 'BEKLIYOR'),
(3, 750.00, 4, 2026, '2026-04-25', 'GECIKTI'),
(4, 750.00, 4, 2026, '2026-04-25', 'ODENDI'),
(5, 750.00, 4, 2026, '2026-04-25', 'BEKLIYOR'),
-- Mayıs 2026
(1, 750.00, 5, 2026, '2026-05-25', 'BEKLIYOR'),
(2, 750.00, 5, 2026, '2026-05-25', 'BEKLIYOR'),
(3, 750.00, 5, 2026, '2026-05-25', 'BEKLIYOR'),
(4, 750.00, 5, 2026, '2026-05-25', 'BEKLIYOR'),
(5, 750.00, 5, 2026, '2026-05-25', 'BEKLIYOR');

-- ============================================================
-- ENERJİ OKUMA EKLEMELERİ
-- ============================================================
INSERT INTO enerji_okumalari (bina_id, okuma_tarihi, elektrik_kwh, su_m3, dogalgaz_m3,
    elektrik_maliyet, su_maliyet, dogalgaz_maliyet, toplam_maliyet, donem_ay, donem_yil, tasarruf_onerisi)
VALUES
(1, '2026-01-31', 4200, 240, 180, 14700, 3600, 1440, 19740, 1, 2026,
 'Ocak ayında doğalgaz tüketimi yüksek. Bina yalıtımının kontrol edilmesi önerilir.'),
(1, '2026-02-28', 3900, 210, 165, 13650, 3150, 1320, 18120, 2, 2026,
 'Tüketim değerleri normal seviyelerde.'),
(1, '2026-03-31', 3600, 195, 120, 12600, 2925, 960, 16485, 3, 2026,
 'Tüketim değerleri normal seviyelerde.'),
(1, '2026-04-30', 3400, 200, 80, 11900, 3000, 640, 15540, 4, 2026,
 'Nisan ayı tüketim verileri iyi görünüyor. LED aydınlatmaya geçişin katkısı hissedilmekte.');

-- ============================================================
-- GİDER EKLEMELERİ
-- ============================================================
INSERT INTO giderler (bina_id, kategori, aciklama, tutar, gider_tarihi, tedarikci, fatura_nu, olusturan_id)
VALUES
(1, 'Temizlik', 'Ocak ayı temizlik hizmeti', 2500.00, '2026-01-31', 'Temiz Dünya Ltd.', 'TD-2026-001', 1),
(1, 'Elektrik', 'Ocak ayı elektrik faturası (ortak alanlar)', 4800.00, '2026-01-15', 'TEDAŞ', 'TEDAS-2026-01', 1),
(1, 'Su', 'Ocak ayı su faturası', 1200.00, '2026-01-20', 'İSKİ', 'ISKI-2026-01', 1),
(1, 'Bakım', 'Asansör yıllık bakım sözleşmesi', 12000.00, '2026-01-05', 'Otis Türkiye', 'OTIS-2026-01', 1),
(1, 'Temizlik', 'Şubat ayı temizlik hizmeti', 2500.00, '2026-02-28', 'Temiz Dünya Ltd.', 'TD-2026-002', 1),
(1, 'Elektrik', 'Şubat ayı elektrik faturası', 4200.00, '2026-02-15', 'TEDAŞ', 'TEDAS-2026-02', 1),
(1, 'Su', 'Şubat ayı su faturası', 1100.00, '2026-02-20', 'İSKİ', 'ISKI-2026-02', 1),
(1, 'Güvenlik', 'Şubat ayı güvenlik personeli ücreti', 8000.00, '2026-02-28', NULL, NULL, 1),
(1, 'Temizlik', 'Mart ayı temizlik hizmeti', 2500.00, '2026-03-31', 'Temiz Dünya Ltd.', 'TD-2026-003', 2),
(1, 'Elektrik', 'Mart ayı elektrik faturası', 3900.00, '2026-03-15', 'TEDAŞ', 'TEDAS-2026-03', 2),
(1, 'Su', 'Mart ayı su faturası', 980.00, '2026-03-20', 'İSKİ', 'ISKI-2026-03', 2),
(1, 'Güvenlik', 'Mart ayı güvenlik personeli ücreti', 8000.00, '2026-03-31', NULL, NULL, 2),
(1, 'Peyzaj', 'Bahçe düzenleme ve çiçeklendirme', 3500.00, '2026-04-10', 'Yeşil Peyzaj', 'YP-2026-01', 2);

-- ============================================================
-- BAKIM TALEBİ EKLEMELERİ
-- ============================================================
INSERT INTO bakim_talepleri (daire_id, sakin_id, baslik, aciklama, oncelik, durum, kategori)
VALUES
(1, 3, 'Mutfak musluğu sızıntısı', 'Mutfak lavabo musluğundan damla damla su akıyor.', 'NORMAL', 'COZULDU', 'Tesisat'),
(2, 4, 'Bozuk elektrik prizi', 'Salon duvarındaki priz çalışmıyor, elektrikçi gerekli.', 'YUKSEK', 'ISLEME_ALINDI', 'Elektrik'),
(4, 5, 'Kapı kilidi arızası', 'Giriş kapısı kilidi zorlanıyor, değiştirilmesi gerekiyor.', 'ACIL', 'ACIK', 'Marangozluk'),
(1, 3, 'Pencere sızdırmazlık sorunu', 'Yatak odası penceresinden rüzgar geliyor.', 'DUSUK', 'ACIK', 'İnşaat');

-- ============================================================
-- OYLAMA EKLEMELERİ
-- ============================================================
INSERT INTO oylamalar (baslik, aciklama, olusturan_id, baslangic_tarihi, bitis_tarihi, durum)
VALUES
('Bahçe Düzenlemesi Anketi',
 'Sitenin ortak bahçesi için hangi düzenlemeyi tercih edersiniz?',
 1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'AKTIF'),
('Güneş Paneli Kurulumu',
 'Binanın çatısına güneş paneli kurulması konusunda görüşünüzü belirtiniz.',
 1, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 'AKTIF');

INSERT INTO oylama_secenekler (oylama_id, secenek)
VALUES
(1, 'Çocuk oyun parkı'),
(1, 'Oturma alanları ve banklar'),
(1, 'Spor aletleri'),
(1, 'Yalnızca yeşil alan'),
(2, 'Evet, kurulmalı'),
(2, 'Hayır, gerekli değil'),
(2, 'Daha fazla araştırma yapılsın');
