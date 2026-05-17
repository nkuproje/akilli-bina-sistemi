# Akıllı Bina ve Enerji Yönetim Sistemi

**BMB306 Yazılım Mühendisliği** | Tekirdağ Namık Kemal Üniversitesi | 2025-2026 Bahar Dönemi

**Grup:** Umut Berk Savi, Hayrettin Enes Ata, Gökçe Gör

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Backend | Java 17 + Spring Boot 3.2.3 |
| Frontend | React.js 18 + Tailwind CSS |
| Veritabanı | MySQL 8.0 |
| Güvenlik | JWT (JSON Web Token) |
| Migration | Flyway |
| Grafikler | Recharts |

---

## Kurulum ve Çalıştırma

### Ön Gereksinimler
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

---

### 1. Veritabanı Kurulumu

MySQL'de aşağıdaki komutu çalıştırın:

```sql
CREATE DATABASE akilli_bina_db CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
```

> **Not:** Tablo oluşturma ve örnek veriler Flyway migration ile otomatik uygulanır.

---

### 2. Backend Kurulumu

```bash
cd backend
```

`src/main/resources/application.properties` dosyasındaki veritabanı bilgilerini güncelleyin:

```properties
spring.datasource.username=YOUR_MYSQL_USER
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Çalıştırın:

```bash
mvn spring-boot:run
```

Backend `http://localhost:8080` adresinde çalışmaya başlar.  
Flyway migration otomatik olarak V1 (şema) ve V2 (örnek veriler) script'lerini uygular.

---

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

Uygulama `http://localhost:3000` adresinde açılır.

---

## Demo Hesapları

| E-posta | Şifre | Rol |
|---|---|---|
| admin@akasyasitesi.com | password123 | Üst Yönetici |
| yonetici@akasyasitesi.com | password123 | Orta Yönetici |
| sakin1@mail.com | password123 | Sakin (Daire 1A) |
| sakin2@mail.com | password123 | Sakin (Daire 1B) |
| sakin3@mail.com | password123 | Sakin (Daire 2A) |

---

## Modüller

### 🏠 Dashboard
- Anlık istatistikler (toplam daire, ödeme bekleyen aidat, açık bakım talebi)
- Aylık enerji tüketim grafiği (Recharts)
- Son duyurular

### 💰 Aidat Yönetimi
- Dönem bazlı aidat oluşturma (yönetici)
- Ödeme durumu takibi (Bekliyor / Ödendi / Gecikmiş)
- Sakin kendi aidatlarını görür

### 🔧 Bakım Talepleri
- Arıza/bakım bildirimi oluşturma
- Durum takibi: Açık → İşlemde → Tamamlandı
- Yönetici tüm talepleri yönetir

### 📢 Duyurular
- Yönetici duyuru yayınlar/siler
- Tüm sakinler duyuruları görüntüler

### ⚡ Enerji Yönetimi
- Aylık tüketim verisi girişi
- Bar grafik ile görselleştirme
- Tasarruf önerileri

### 💳 Gelir-Gider Yönetimi
- Gider kategorileme
- Pasta grafik ile kategori dağılımı

### 🗳️ Oylama Sistemi
- Yönetici oylama oluşturur
- Sakinler oy kullanır
- Gerçek zamanlı sonuç görüntüleme

---

## API Endpoint'leri

| Method | URL | Yetki | Açıklama |
|---|---|---|---|
| POST | /api/auth/login | Herkese açık | Giriş yap |
| POST | /api/auth/register | Herkese açık | Sakin kaydı |
| GET | /api/aidatlar | Yönetici | Tüm aidatlar |
| GET | /api/aidatlar/benim | Sakin | Kendi aidatları |
| POST | /api/aidatlar/olustur | Yönetici | Dönem aidatı oluştur |
| PUT | /api/aidatlar/{id}/ode | Yönetici | Ödeme al |
| GET/POST | /api/bakim | Tümü | Bakım talepleri |
| PUT | /api/bakim/{id}/durum | Yönetici | Durum güncelle |
| GET/POST | /api/duyurular | Tümü/Yönetici | Duyurular |
| GET/POST | /api/enerji | Tümü/Yönetici | Enerji okumaları |
| GET/POST | /api/giderler | Yönetici | Giderler |
| GET/POST | /api/oylamalar | Tümü | Oylamalar |
| POST | /api/oylamalar/{id}/oy-ver | Sakin | Oy kullan |

---

## Proje Yapısı

```
akilli-bina-sistemi/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/akillibina/
│       │   ├── entity/          # JPA Entity'ler
│       │   ├── repository/      # Spring Data JPA
│       │   ├── service/         # İş mantığı
│       │   ├── controller/      # REST Controller'lar
│       │   ├── security/        # JWT Filter, SecurityConfig
│       │   └── config/
│       └── resources/
│           ├── application.properties
│           └── db/migration/
│               ├── V1__initial_schema.sql
│               └── V2__seed_data.sql
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── App.js
        ├── context/AuthContext.js
        ├── services/api.js
        ├── components/Layout.js
        └── pages/
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── Dashboard.js
            ├── AidatPage.js
            ├── BakimPage.js
            ├── DuyuruPage.js
            ├── EnerjiPage.js
            ├── GiderPage.js
            └── OylamaPage.js
```
