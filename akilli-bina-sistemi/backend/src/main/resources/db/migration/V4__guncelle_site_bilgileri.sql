-- ============================================================
-- V4: Site adı ve kullanıcı bilgilerini güncelle
-- Akasya Sitesi → Ata Sitesi
-- Mehmet Yılmaz (Üst Yönetici) → Umut Berk Savi
-- Ayşe Kaya (Orta Yönetici) → Hayrettin Enes Ata
-- ============================================================

-- Bina adlarını güncelle
UPDATE binalar SET ad = 'Ata Sitesi A Blok' WHERE ad = 'Akasya Sitesi A Blok';
UPDATE binalar SET ad = 'Ata Sitesi B Blok' WHERE ad = 'Akasya Sitesi B Blok';

-- Üst Yönetici: isim + email
UPDATE users
SET ad_soyad = 'Umut Berk Savi',
    email    = 'admin@atasitesi.com'
WHERE rol = 'UST_YONETICI'
  AND (email = 'admin@akasyasitesi.com' OR ad_soyad = 'Mehmet Yılmaz');

-- Orta Yönetici: isim + email
UPDATE users
SET ad_soyad = 'Hayrettin Enes Ata',
    email    = 'yonetici@atasitesi.com'
WHERE rol = 'ORTA_YONETICI'
  AND (email = 'yonetici@akasyasitesi.com' OR ad_soyad = 'Ayşe Kaya');
