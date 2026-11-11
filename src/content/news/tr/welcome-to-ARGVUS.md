---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: ARGVUS'a Hoş Geldiniz
description: Arch Linux için Wayland ve Hyprland üzerine kurulu; ayarları, görünümü, oturum araçlarını ve uygulamaları bütünleştiren modüler masaüstü ortamı ARGVUS'u keşfedin.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---

# ARGVUS'a Hoş Geldiniz

Bugün **ARGVUS**'u tanıtıyoruz: **Arch Linux** için tasarlanmış, **Wayland** üzerinde çalışan ve **Hyprland** tarafından desteklenen modüler bir masaüstü ortamı.

ARGVUS, bir Linux masaüstünün parçalarını bir araya getirir: oturum açma ve oturumu başlatma, pencereler ve çalışma alanları, görev çubuğu ve hızlı kontrol paneli, ayarlar, temalar, bildirimler, ekranlar, güç, ağ ve günlük uygulamalar. Bu parçalar ortak bir yapılandırma modelini paylaşan, belirli amaçlara yönelik paketler halinde düzenlenmiştir. Böylece masaüstü tek bir sistem gibi çalışır, ancak dev bir monolitik programa dönüşmez.

> **Kısaca:** Arch Linux işletim sistemidir, Hyprland Wayland bileştiricisidir ve ARGVUS bunların çevresindeki oturum ile masaüstü deneyimini koordine eder.

## Birlikte çalışan masaüstü bileşenleri

ARGVUS oturumu, girişten masaüstüne kadar açık bir akış izler:

```text
Giriş veya TTY
    ↓
ARGVUS oturumu → Hyprland
    ↓
Görev Çubuğu · Kontrol Paneli · Bildirimler · Duvar Kâğıdı · Boşta Hizmetleri
```

Oturum yöneticisi masaüstü hizmetlerini başlatır ve denetler. Hyprland pencereleri, çalışma alanlarını ve monitörleri yönetir. Görev çubuğu, Kontrol Paneli, ayarlar uygulaması ve amaca yönelik hizmet paketleri her gün kullandığınız arayüzleri sağlar.

| Alan | Masaüstünüze kattıkları |
| --- | --- |
| **Giriş ve oturumlar** | ARGVUS karşılama ekranı, grafiksel giriş, TTY üzerinden başlatma ve yönetilen kullanıcı hizmetleri. |
| **Pencereler ve çalışma alanları** | Klavye kısayolları, düzenler, monitör yönetimi ve paylaşılan görünüm ayarları içeren bir Hyprland kurulumu. |
| **Görev çubuğu** | Çalışma alanları, pencereler ve sistem durumu için isteğe bağlı araç takımları da sunan Waybar tabanlı bir çubuk. |
| **Kontrol Paneli** | Hızlı işlemler, oturum ve güç denetimleri ile masaüstü araç takımları için Quickshell arayüzü. |
| **Kontrol Merkezi** | Masaüstü yapılandırması ve yönetimi için klavye kullanımını öne çıkaran bir ayarlar uygulaması. |
| **Masaüstü hizmetleri** | Ekranlar, ağ, Bluetooth, güç, bildirimler, güvenlik duvarı ve çıkarılabilir depolama için özel bütünleştirmeler. |

Her bileşen kendi komutlarını ve hizmet davranışını yönetir. Bu modüler tasarım, masaüstünün tamamını birbirine sıkı sıkıya bağlı tek bir uygulamaya dönüştürmeden parçaları korumayı veya geliştirmeyi mümkün kılar.

## Birlikte çalışan ayarlar

Bir ayarı değiştirmek, masaüstünün tamamında öngörülebilir bir etki yaratmalıdır. ARGVUS görünüm ve tercih durumunu merkezi olarak saklar, ardından ilgili bileşenlere uygular. Kontrol Merkezi ayarları değiştirmek için yönlendirmeli bir alan sunar; terminali tercih ederseniz komut satırı araçları da mevcuttur.

Örneğin bir tema değişikliği; bileştiriciyi, GTK ve Qt uygulamalarını, görev çubuğunu, Kontrol Paneli'ni, başlatıcıyı, bildirimleri ve kilit ekranını birlikte güncelleyebilir. Bir vurgu rengi ve düzen stili de seçebilirsiniz:

| Stil | Görünüm |
| --- | --- |
| **Sticky** | Daha dar boşluklar ve pencerelerle masaüstü yüzeyleri arasında daha yakın bir yerleşim. |
| **Spaced** | Daha geniş aralıklar, yuvarlatılmış köşeler, gölgeler ve masaüstü kabuğunun çevresinde daha fazla ferahlık. |

Görsel sistem, her biri iki stilde de kullanılabilen **23 tema ailesinin** yanı sıra duvar kâğıtları, yazı tipleri, simge temaları ve yapılandırılabilir efektler içerir. Hazır bir görünüm seçebilir veya vurgu rengini kendinize göre ayarlayabilirsiniz.

> **Yararlı bir ayrım:** Seçtiğiniz tercihler temel doğruluk kaynağıdır. Masaüstünün ayrı bileşenleri için oluşturulan dosyalar bu paylaşılan durumun yansımalarıdır. Bu nedenle oluşturulmuş çıktıları düzenlemek yerine ARGVUS ayarlarını veya desteklenen komutları kullanın.

## Birbirine bağlanmış kullanışlı araçlar

ARGVUS, sık yapılan işleri kolaylaştırmak için çeşitli küçük kolaylıklar sunar veya bütünleştirir:

- **Uygulama başlatıcısı:** Kurulu grafik uygulamalarını bulmak için `SUPER + D` tuşlarına basın. Ek klavye menüleri projeleri, SSH sunucularını, kod parçalarını, emojileri, hesap makinesini ve başvuru notlarını açabilir.
- **Ekran denetimleri:** Monitörleri inceleyin; etkin bileştirici ve donanım destekliyorsa çözünürlük, yenileme hızı, ölçek, konum ve yön gibi ayarları değiştirin.
- **Güç ve oturum işlemleri:** Hemen kilitlemek, askıya almak, oturumu kapatmak veya sistemi kapatmak için Kontrol Paneli'ni kullanın. Kalıcı boşta kalma ve ekran davranışını Kontrol Merkezi'nde yapılandırın.
- **Rahatsız Etmeyin:** Bildirimlerin iletilmesini Kontrol Paneli'nden yönetin; bu özellik etkin olduğunda alınan bildirimler daha sonra görüntülenmek üzere saklanır.
- **Çıkarılabilir aygıtlar:** Bütünleşik menüler ve görev çubuğu arayüzlerinden depolama işlemlerine erişin.
- **ARGVUS Focus:** Yerel geçmişiyle birlikte Pomodoro tarzı odak oturumları, molalar ve bildirimler başlatın.
- **ARGVUS Clock:** Dünya saatlerini, kronometreyi, zamanlayıcıları ve alarmları kullanın; erteleme ve kaçırılan alarm raporları da dahildir.
- **Terminal araçları:** Yapılandırılmış terminal profillerini, sistem izleyicisini ve diğer bütünleşik TUI uygulamalarını açın.

Bazı özellikler isteğe bağlı paketler olarak sunulur. Örneğin programlama ajanı bütünleştirmeleri ve oyunlar, temel oturumun zorunlu parçaları olmadan eklenebilir. Yapay zekâ bütünleştirmeleri seçilen ajanı bir terminalde başlatır; ARGVUS sizin için hesap oluşturmaz veya API anahtarı ya da abonelik yapılandırmaz.

## Arch Linux'ta başlayın

Yeni bir Arch Linux kurulumunda belgelenen hızlı başlangıç şöyledir:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

Yükleyici ARGVUS paket deposunu yapılandırır ve `argvus` paketini bağımlılıklarıyla birlikte yükler. Ardından oturumu kapatıp görüntü yöneticinizden **ARGVUS**'u seçin veya TTY üzerinden bir ARGVUS oturumu başlatın.

```sh
# Kontrol Merkezi'ni açın
argvus --control-center

# İlk kurulum kılavuzunu istediğiniz zaman yeniden açın
argvus welcome
```

ARGVUS **Arch Linux**, **Wayland** ve **Hyprland** için geliştirilmiştir; bağımsız bir Linux dağıtımı değildir. Yüklemeden önce gereksinimler, elle kurulum ve güncel paket bilgileri için [kurulum kılavuzuna](https://argvus.github.io/docs/getting-started/installation/) bakın.

## ARGVUS'u keşfedin

Kurulum ve günlük kullanım için [kullanıcı belgeleriyle](https://argvus.github.io/docs/intro/) başlayın veya tek tek bileşenleri keşfetmek için [ARGVUS kaynak deposunu](https://github.com/argvus/argvus) ve [GitHub'daki ARGVUS organizasyonunu](https://github.com/argvus/) inceleyin.

Altyapısı modüler, önemli noktalarda koordineli bir masaüstüne hoş geldiniz. **ARGVUS'a hoş geldiniz.**
