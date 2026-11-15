# NersCalc - Asisten & Kalkulator Klinis S.Kep
**Created by: Ari Suandi Putra**

Aplikasi asisten dan kalkulator klinis profesional khusus sarjana keperawatan (**S.Kep**) dengan arsitektur modern React + Vite, PWA offline, Soft Medical Neumorphism, Dark Mode, dan sistem keamanan privasi.

---

## 🔒 Konfigurasi Keamanan & Akses

Aplikasi menggunakan autentikasi berbasis session peramban (`localStorage`) dengan variabel lingkungan privat (`.env`).

Untuk mengatur kredensial akses lokal atau deployment:
1. Salin file template `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan kredensial di file `.env`:
   ```env
   VITE_NURSE_USERNAME=perawat_anda
   VITE_NURSE_PASSWORD=kata_sandi_anda
   VITE_ADMIN_USERNAME=admin_anda
   VITE_ADMIN_PASSWORD=kata_sandi_admin
   ```
3. File `.env` telah didaftarkan ke `.gitignore` sehingga aman dari kebocoran saat diunggah ke repositori publik/GitHub.

---

## 🌟 Fitur Utama & Keunggulan

1. **Splash Screen EKG Lead II Interaktif**
   - Animasi grafik detak jantung osiloskop Lead II (P-Q-R-S-T) menyapu dari kiri ke kanan dengan monitor beep realistis.
   - Ditampilkan sekali saat inisialisasi aplikasi sebelum form login.
   - Tidak mengganggu produktivitas saat halaman di-refresh di dalam dashboard.

2. **Soft Medical Neumorphism (Light & Dark Mode)**
   - **Mode Terang:** Efek 3D Emboss timbul lembut khas scrub perawat (`#E6ECF2`) dengan teks kontras tajam.
   - **Mode Gelap:** Layar redup nyaman shift malam (`#0A0D12` & `#13171D`) bebas silau dan bebas glow putih.
   - **Palet Warna Aksen Scrub:** Sage Emerald, Warm Orange, Burgundy Wine, Monochrome Slate, Blossom Pink, dan Blue Sky.
   - **Dukungan Responsif Penuh:** Pengubah tema dan warna aksen dapat diakses langsung di mobile maupun desktop.

3. **Kalkulator Klinis Lengkap Khusus S.Kep**
   - **Kalkulator TPM Infus & Metronom:** Hitung tetes per menit (Makro 20, Mikro 60, Darah 15) dengan metronom audio tetesan sinkron.
   - **Dosis Obat & Syringe Pump:** Konversi mcg/kgBB/menit ke mL/jam, rumus oplosan vial/ampul, dosis pediatrik.
   - **Balance Cairan 24 Jam & IWL:** Keseimbangan intake-output dengan koreksi demam (suhu > 37.5°C) dan evaluasi perfusi ginjal.
   - **Skoring GCS & Refleks Pupil:** Penilaian derajat kesadaran (Eye, Verbal, Motorik) + respon pupil.
   - **Catatan Operan Shift (SBAR):** Format Situation, Background, Assessment, Recommendation siap salin 1-klik.

4. **Protokol Cepat "Jangan Panik! Lakukan Ini" (Emergency SOPs)**
   - Algoritma tata laksana cepat Syok Anafilaktik, Henti Jantung (Code Blue/RJP), Hipoglikemia Akut, Ekstravasasi Infus High Alert, dll.

5. **Reader Dokumen Terintegrasi**
   - Pembaca modul PDF, tabel Excel (.xlsx/.csv), dan Word (.docx) langsung di dalam aplikasi.

6. **Pengingat Ibadah & Nutrisi Terjadwal (WIB)**
   - Pengingat otomatis waktu Zuhur & makan siang (12:15 WIB), Ashar (15:40 WIB), Maghrib (18:25 WIB), dan Isya (19:35 WIB).

---

## 🚀 Panduan Menjalankan Proyek

```bash
# 1. Instal dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev

# 3. Build untuk produksi
npm run build
```

---
&copy; Ari Suandi Putra &bull; NersCalc Professional S.Kep
