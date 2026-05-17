-- Akıllı Bina ve Enerji Yönetim Sistemi - Veritabanı Şeması
-- V1: İlk şema oluşturma

CREATE DATABASE IF NOT EXISTS akilli_bina_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_turkish_ci;

USE akilli_bina_db;

-- ============================================================
-- BINALAR TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS binalar (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    ad                  VARCHAR(100) NOT NULL,
    adres               VARCHAR(255) NOT NULL,
    kat_sayisi          INT,
    toplam_daire_sayisi INT,
    yonetici_adi        VARCHAR(100),
    yonetici_telefon    VARCHAR(20),
    olusturma_tarihi    DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- DAİRELER TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS daireler (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    bina_id          BIGINT NOT NULL,
    kat_no           INT NOT NULL,
    daire_no         VARCHAR(10) NOT NULL,
    metrekare        DECIMAL(8, 2),
    tip              ENUM('KONUT', 'ISYERI', 'DEPO') DEFAULT 'KONUT',
    dolu             TINYINT(1) DEFAULT 0,
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_daire_bina FOREIGN KEY (bina_id) REFERENCES binalar(id) ON DELETE CASCADE,
    UNIQUE KEY uk_bina_daire (bina_id, daire_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- KULLANICLAR TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    email               VARCHAR(100) NOT NULL UNIQUE,
    password            VARCHAR(255) NOT NULL,
    ad_soyad            VARCHAR(100) NOT NULL,
    telefon             VARCHAR(20),
    rol                 ENUM('UST_YONETICI', 'ORTA_YONETICI', 'SAKIN') NOT NULL,
    daire_id            BIGINT,
    aktif               TINYINT(1) DEFAULT 1,
    olusturma_tarihi    DATETIME DEFAULT CURRENT_TIMESTAMP,
    guncellenme_tarihi  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_daire FOREIGN KEY (daire_id) REFERENCES daireler(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- AIDATLAR TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS aidatlar (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    daire_id         BIGINT NOT NULL,
    tutar            DECIMAL(10, 2) NOT NULL,
    donem_ay         INT NOT NULL,
    donem_yil        INT NOT NULL,
    son_odeme_tarihi DATE NOT NULL,
    odeme_tarihi     DATE,
    durum            ENUM('BEKLIYOR', 'ODENDI', 'GECIKTI') DEFAULT 'BEKLIYOR',
    aciklama         VARCHAR(255),
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aidat_daire FOREIGN KEY (daire_id) REFERENCES daireler(id) ON DELETE CASCADE,
    INDEX idx_aidat_durum (durum),
    INDEX idx_aidat_donem (donem_ay, donem_yil)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- BAKIM TALEPLERİ TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS bakim_talepleri (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    daire_id            BIGINT NOT NULL,
    sakin_id            BIGINT NOT NULL,
    baslik              VARCHAR(200) NOT NULL,
    aciklama            TEXT,
    oncelik             ENUM('DUSUK', 'NORMAL', 'YUKSEK', 'ACIL') DEFAULT 'NORMAL',
    durum               ENUM('ACIK', 'ISLEME_ALINDI', 'COZULDU', 'IPTAL_EDILDI') DEFAULT 'ACIK',
    kategori            VARCHAR(50),
    atanan_personel_id  BIGINT,
    cozulme_tarihi      DATETIME,
    cozum_notu          TEXT,
    olusturma_tarihi    DATETIME DEFAULT CURRENT_TIMESTAMP,
    guncellenme_tarihi  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bakim_daire    FOREIGN KEY (daire_id)          REFERENCES daireler(id),
    CONSTRAINT fk_bakim_sakin    FOREIGN KEY (sakin_id)           REFERENCES users(id),
    CONSTRAINT fk_bakim_personel FOREIGN KEY (atanan_personel_id) REFERENCES users(id),
    INDEX idx_bakim_durum (durum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- DUYURULAR TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS duyurular (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    baslik           VARCHAR(200) NOT NULL,
    icerik           TEXT NOT NULL,
    olusturan_id     BIGINT NOT NULL,
    onemli           TINYINT(1) DEFAULT 0,
    aktif            TINYINT(1) DEFAULT 1,
    yayin_tarihi     DATETIME DEFAULT CURRENT_TIMESTAMP,
    bitis_tarihi     DATETIME,
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_duyuru_kullanici FOREIGN KEY (olusturan_id) REFERENCES users(id),
    INDEX idx_duyuru_aktif (aktif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- ENERJİ OKUMALARI TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS enerji_okumalari (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    bina_id             BIGINT NOT NULL,
    okuma_tarihi        DATE NOT NULL,
    elektrik_kwh        DECIMAL(10, 2),
    su_m3               DECIMAL(10, 2),
    dogalgaz_m3         DECIMAL(10, 2),
    elektrik_maliyet    DECIMAL(10, 2),
    su_maliyet          DECIMAL(10, 2),
    dogalgaz_maliyet    DECIMAL(10, 2),
    toplam_maliyet      DECIMAL(10, 2),
    donem_ay            INT,
    donem_yil           INT,
    tasarruf_onerisi    TEXT,
    olusturma_tarihi    DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enerji_bina FOREIGN KEY (bina_id) REFERENCES binalar(id),
    INDEX idx_enerji_donem (donem_ay, donem_yil)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- GİDERLER TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS giderler (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    bina_id          BIGINT NOT NULL,
    kategori         VARCHAR(100) NOT NULL,
    aciklama         VARCHAR(255) NOT NULL,
    tutar            DECIMAL(10, 2) NOT NULL,
    gider_tarihi     DATE NOT NULL,
    tedarikci        VARCHAR(100),
    fatura_nu        VARCHAR(50),
    olusturan_id     BIGINT,
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gider_bina      FOREIGN KEY (bina_id)      REFERENCES binalar(id),
    CONSTRAINT fk_gider_kullanici FOREIGN KEY (olusturan_id) REFERENCES users(id),
    INDEX idx_gider_kategori (kategori),
    INDEX idx_gider_tarih (gider_tarihi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

-- ============================================================
-- OYLAMALAR TABLOSU
-- ============================================================
CREATE TABLE IF NOT EXISTS oylamalar (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    baslik             VARCHAR(200) NOT NULL,
    aciklama           TEXT,
    olusturan_id       BIGINT NOT NULL,
    baslangic_tarihi   DATETIME DEFAULT CURRENT_TIMESTAMP,
    bitis_tarihi       DATETIME,
    durum              ENUM('AKTIF', 'TAMAMLANDI', 'IPTAL_EDILDI') DEFAULT 'AKTIF',
    olusturma_tarihi   DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_oylama_kullanici FOREIGN KEY (olusturan_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS oylama_secenekler (
    oylama_id BIGINT NOT NULL,
    secenek   VARCHAR(200) NOT NULL,
    CONSTRAINT fk_secenek_oylama FOREIGN KEY (oylama_id) REFERENCES oylamalar(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS oylama_yanitlari (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    oylama_id         BIGINT NOT NULL,
    kullanici_id      BIGINT NOT NULL,
    secilen_secenek   VARCHAR(200) NOT NULL,
    olusturma_tarihi  DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_yanit_oylama    FOREIGN KEY (oylama_id)    REFERENCES oylamalar(id),
    CONSTRAINT fk_yanit_kullanici FOREIGN KEY (kullanici_id) REFERENCES users(id),
    UNIQUE KEY uk_oylama_kullanici (oylama_id, kullanici_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;
