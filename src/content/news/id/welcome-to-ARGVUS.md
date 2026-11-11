---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Selamat Datang di ARGVUS
description: Kenali ARGVUS, lingkungan desktop modular untuk Arch Linux yang dibangun di atas Wayland dan Hyprland, dengan pengaturan, tampilan, alat sesi, dan aplikasi terintegrasi.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---

# Selamat Datang di ARGVUS

Hari ini kami memperkenalkan **ARGVUS**: lingkungan desktop modular untuk **Arch Linux**, dirancang untuk **Wayland** dan didukung oleh **Hyprland**.

ARGVUS menyatukan bagian-bagian desktop Linux: masuk dan memulai sesi, jendela dan ruang kerja, bilah tugas dan panel kontrol cepat, pengaturan, tema, notifikasi, layar, daya, jaringan, serta aplikasi sehari-hari. Bagian-bagian ini disusun dalam paket khusus yang menggunakan model konfigurasi bersama. Hasilnya, desktop terasa seperti satu sistem tanpa menjadi satu program monolitik.

> **Singkatnya:** Arch Linux adalah sistem operasi, Hyprland adalah compositor Wayland, dan ARGVUS mengoordinasikan sesi serta pengalaman desktop di sekeliling keduanya.

## Desktop dengan komponen yang bekerja bersama

Sesi ARGVUS mengikuti alur yang jelas dari masuk hingga desktop:

```text
Masuk atau TTY
    ↓
Sesi ARGVUS → Hyprland
    ↓
Bilah Tugas · Panel Kontrol · Notifikasi · Wallpaper · Layanan idle
```

Manajer sesi memulai dan mengawasi layanan desktop. Hyprland mengelola jendela, ruang kerja, dan monitor. Bilah tugas, Panel Kontrol, aplikasi pengaturan, dan paket layanan khusus menyediakan antarmuka yang Anda gunakan setiap hari.

| Area | Manfaat untuk desktop Anda |
| --- | --- |
| **Masuk dan sesi** | Greeter ARGVUS, login grafis, memulai dari TTY, serta layanan pengguna yang dikelola. |
| **Jendela dan ruang kerja** | Pengaturan Hyprland dengan pintasan keyboard, tata letak, pengelolaan monitor, dan pengaturan tampilan bersama. |
| **Bilah tugas** | Bilah berbasis Waybar untuk ruang kerja, jendela, dan status sistem, dengan widget opsional. |
| **Panel Kontrol** | Antarmuka Quickshell untuk tindakan cepat, kontrol sesi dan daya, serta widget desktop. |
| **Pusat Kontrol** | Aplikasi pengaturan yang mengutamakan keyboard untuk konfigurasi dan administrasi desktop. |
| **Layanan desktop** | Integrasi khusus untuk layar, jaringan, Bluetooth, daya, notifikasi, firewall, dan media penyimpanan lepas-pasang. |

Setiap komponen mengelola perintah dan perilaku layanannya sendiri. Desain modular ini memungkinkan satu bagian dirawat atau ditingkatkan tanpa menjadikan seluruh desktop sebagai satu aplikasi yang saling terikat erat.

## Pengaturan yang bekerja bersama

Perubahan pengaturan seharusnya memberikan dampak yang dapat diprediksi di seluruh desktop. ARGVUS menyimpan status tampilan dan preferensi secara terpusat, lalu menerapkannya ke komponen yang menggunakannya. Pusat Kontrol menyediakan cara terpandu untuk mengubah pengaturan; alat baris perintah tersedia jika Anda lebih menyukai terminal.

Sebagai contoh, perubahan tema dapat memperbarui compositor, aplikasi GTK dan Qt, bilah tugas, Panel Kontrol, peluncur, notifikasi, dan layar kunci secara bersamaan. Anda juga dapat memilih warna aksen dan gaya tata letak:

| Gaya | Kesan |
| --- | --- |
| **Sticky** | Jarak yang ringkas dan penempatan jendela yang lebih dekat dengan permukaan desktop. |
| **Spaced** | Jarak lebih lebar, sudut membulat, bayangan, dan lebih banyak ruang di sekitar shell desktop. |

Sistem visualnya mencakup **23 keluarga tema**, masing-masing tersedia dalam kedua gaya, serta wallpaper, font, tema ikon, dan efek yang dapat dikonfigurasi. Pilih tampilan siap pakai atau sesuaikan warna aksen agar terasa milik Anda.

> **Perbedaan yang perlu diketahui:** preferensi yang Anda pilih adalah sumber kebenaran. Berkas yang dibuat untuk komponen desktop tertentu merupakan proyeksi dari status bersama tersebut. Karena itu, ubah pengaturan melalui ARGVUS atau perintah yang didukung, bukan dengan mengedit keluaran yang dihasilkan.

## Alat praktis yang sudah terhubung

ARGVUS menyertakan atau mengintegrasikan berbagai kemudahan kecil agar tugas umum mudah dijangkau:

- **Peluncur aplikasi:** tekan `SUPER + D` untuk menemukan aplikasi grafis yang terpasang. Menu keyboard tambahan dapat membuka proyek, host SSH, snippet, emoji, kalkulator, dan lembar contekan.
- **Kontrol layar:** periksa monitor dan sesuaikan resolusi, refresh rate, skala, posisi, serta orientasi jika compositor aktif dan perangkat keras mendukungnya.
- **Tindakan daya dan sesi:** gunakan Panel Kontrol untuk segera mengunci, menangguhkan, keluar, atau mematikan sistem. Atur perilaku idle dan layar yang persisten di Pusat Kontrol.
- **Jangan Ganggu:** kendalikan pengiriman notifikasi dari Panel Kontrol; notifikasi yang diterima saat fitur ini aktif disimpan untuk nanti.
- **Perangkat lepas-pasang:** akses tindakan penyimpanan melalui menu terintegrasi dan antarmuka bilah tugas.
- **ARGVUS Focus:** jalankan sesi fokus bergaya Pomodoro, istirahat, dan notifikasi dengan riwayat lokal.
- **ARGVUS Clock:** gunakan jam dunia, stopwatch, timer, dan alarm, termasuk tunda dan laporan alarm yang terlewat.
- **Alat terminal:** buka profil terminal yang dikonfigurasi, pemantau sistem, dan aplikasi TUI terintegrasi lainnya.

Beberapa fitur tersedia sebagai paket opsional. Misalnya, integrasi agen pemrograman dan permainan dapat ditambahkan tanpa menjadikannya bagian wajib dari sesi dasar. Integrasi AI menjalankan agen yang dipilih di terminal; ARGVUS tidak membuat akun atau mengatur kunci API maupun langganan untuk Anda.

## Memulai di Arch Linux

Pada instalasi Arch Linux yang baru, panduan memulai cepat yang terdokumentasi adalah:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

Pemasang mengonfigurasi repositori paket ARGVUS dan memasang paket `argvus` beserta dependensinya. Setelah itu, keluar dari sesi dan pilih **ARGVUS** di display manager, atau mulai sesi ARGVUS dari TTY.

```sh
# Buka Pusat Kontrol
argvus --control-center

# Buka kembali panduan penyiapan pertama kapan saja
argvus welcome
```

ARGVUS dibuat untuk **Arch Linux**, **Wayland**, dan **Hyprland**; ini bukan distribusi Linux mandiri. Sebelum memasang, lihat [panduan instalasi](https://argvus.github.io/docs/getting-started/installation/) untuk persyaratan, penyiapan manual, dan detail paket terkini.

## Jelajahi ARGVUS

Mulailah dari [dokumentasi pengguna](https://argvus.github.io/docs/intro/) untuk penyiapan dan penggunaan sehari-hari, atau jelajahi [repositori sumber ARGVUS](https://github.com/argvus/argvus) serta [organisasi ARGVUS di GitHub](https://github.com/argvus/) untuk mengenal komponen-komponen individual.

Selamat datang di desktop yang modular di balik layar dan terkoordinasi pada bagian yang penting. **Selamat datang di ARGVUS.**
