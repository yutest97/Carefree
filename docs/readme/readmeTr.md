<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜AI Kısa Diziler ve Çizgi Diziler için Sonsuz Tuval

Kısa dizi, çizgi dizi ve kısa video üreticileri için yerel bir AI yaratım aracı: sonsuz tuval üzerinde senaryo yazın, storyboard'a bölün, karakterleri ve mekânları yönetin, görsel ve video üretin.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree tamamen yerel çalışan bir AI yaratım aracıdır. Projeler, varlıklar, konuşmalar ve üretim sonuçları kendi cihazınızda saklanır; hiçbir sunucuya kullanım verisi gönderilmez. Model servislerini kendiniz yapılandırırsınız: herhangi bir OpenAI uyumlu arayüz, yerel ComfyUI ve yerel veya kendi barındırdığınız bir TTS servisi.

## Özellikler

| Yetenek | Açıklama |
| --- | --- |
| Sonsuz tuval | Senaryoyu, storyboard'u, karakterleri, mekânları ve video klipleri aynı tuvalde gruplandırma ve bağlantılarla düzenleyin. |
| Metin üretimi | Herhangi bir OpenAI uyumlu metin arayüzüne bağlanın; metin düğümlerinde senaryo, karakter tanımları ve çekim açıklamaları yazın. |
| Görsel üretimi | Kendi ComfyUI iş akışlarınızla karakter dönüş sayfaları, mekânlar ve storyboard görselleri üretin. |
| Video üretimi | ComfyUI veya üçüncü taraf medya arayüzleriyle video çekimleri üretin; birden fazla referans varlık ve üretimi iptal etme desteklenir. |
| Ses üretimi | OpenAI uyumlu `/audio/speech` arayüzüne bağlanın; yerel olarak kurulan TTS ile çevrimdışı seslendirme yapın. |
| Varlık yönetimi | Görseller, videolar ve sesler tek bir varlık kitaplığında toplanır; önizleyin, düzenleyin ve indirin. |
| Yerel öncelik | Servis varsayılan olarak yalnızca bu cihazda dinler; gerektiğinde cihazlar arası bağlantıyı açarak yerel ağda paylaşabilirsiniz. |
| Çok dilli | Arayüz 21 dili destekler. |

Kullanılabilir modeller, çözünürlükler, süreler ve ses özellikleri yapılandırdığınız sağlayıcılara ve iş akışlarına bağlıdır.

### Tipik üretim akışı

1. **Senaryo ve storyboard**: Metin düğümlerini kullanarak hikâyeyi, karakter tanımlarını ve çekim açıklamalarını düzenleyin, dil modeliyle yineleyin.
2. **Karakterler ve mekânlar**: Referans görselleri içe aktarın veya görsel üretim düğümleriyle karakterleri, mekânları ve storyboard görsellerini oluşturun.
3. **Video çekimleri**: Metin ve görsel referanslarını bağlayın, video modelini ve üretim modunu seçin, çekim çekim üretin.
4. **Önizleme ve dışa aktarma**: Tuvalde görselleri ve video kliplerini önizleyin, düzenleyin; varlıkları indirip post prodüksiyona devam edin.

## İstemci kurulumu

| Sistem | Açıklama |
| --- | --- |
| Windows | Yükleyiciyi çalıştırın; WebView2'yi otomatik algılar ve kurar. Kurulumdan sonra uygulama açılırken kapanıyorsa [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) bileşenini elle kurun. |
| macOS (Apple Silicon) | Carefree'yi “Uygulamalar” klasörüne sürükleyip doğrudan açın. Geliştirici doğrulanamıyor uyarısı çıkarsa “Sistem Ayarları → Gizlilik ve Güvenlik” bölümünden açılmasına izin verin. |

`carefree://` protokolü, istemci içinde yeniden başlatma ve derin bağlantı yönlendirmeleri için kullanılır.

## Kaynaktan çalıştırma

Gereksinim: [Bun 1.4.3](https://bun.sh/docs/installation).

```sh
git clone <depo-adresiniz> carefree
cd carefree
bun install --frozen-lockfile

# Geliştirme modu: Web ve Server birlikte başlatılır
bun run dev
```

`http://127.0.0.1:3000` adresini açın. İlk başlatmada yerleşik düğümler, araçlar ve eklentiler başlatılır ve `myProject` çalışma dizini oluşturulur.

### Derleme

```sh
# Düğümleri, uzantıları, Web ve Server'ı derle
bun run build

# Bağımsız Server çıktılarını derle
bun run build:server

# Masaüstü istemcisini derle
bun run build:desktop
bun run package:desktop
```

Windows yükleyicileri varsayılan olarak imzalanmaz. Yayınlamadan önce aşağıdaki ortam değişkenlerini ayarlarsanız `bun run build:desktop` / `bun run package:desktop` dört başlatıcıyı (`startupLauncher.exe`, `protocolLauncher.exe`, `saveFileDialog.exe`, `updateHelper.exe`), yükleyici yardımcılarını (`checkWebView2.exe`, `checkRunning.exe`) ve son `Setup.exe` dosyasını `signtool` ile otomatik olarak imzalar ve imzayı doğrular:

| Değişken | Açıklama |
| --- | --- |
| `CAREFREE_SIGN_PFX` | `.pfx` sertifikasının mutlak yolu; ayarlanmazsa imzalama atlanır |
| `CAREFREE_SIGN_PASSWORD` | Sertifika parolası; sertifika şifreli değilse boş bırakın |
| `CAREFREE_SIGN_TIMESTAMP_URL` | RFC3161 zaman damgası servisi, varsayılan `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | `signtool.exe` yolu; varsayılan olarak Windows SDK içinde otomatik aranır |

Windows x64 ve Windows SDK gerekir. Uygulamanın ana programı artımlı güncelleme tar arşivinin içindedir ve bu imzalama kapsamında değildir; imzalanması gerekiyorsa önce uygulama dosyasını imzalayın, ardından tar ve güncelleme manifestosunu yeniden oluşturun.

GitHub Actions'da sertifika, depo Secrets üzerinden sağlanır; yapılandırıldıktan sonra Windows derlemeleri otomatik olarak imzalanır ve doğrulanır:

| Secret | Açıklama |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | `.pfx` sertifika dosyasının Base64 metni; ayarlanmazsa CI imzalamayı atlar |
| `CAREFREE_SIGN_PASSWORD` | PFX dışa aktarma parolası; şifreli değilse boş bırakın |

Sertifika yalnızca derleme adımı sırasında geçici olarak diske yazılır ve görev sona erdiğinde temizlenir. Zaman damgası adresi `CAREFREE_SIGN_TIMESTAMP_URL` ortam değişkeniyle geçersiz kılınabilir.

### Sunucu

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- Varsayılan olarak `127.0.0.1:3000` adresini dinler ve internete açık değildir.
- Port `TOONFLOW_SERVER_PORT` ile değiştirilebilir.
- Yerel ağ erişimi gerçekten gerekiyorsa `TOONFLOW_SERVER_HOST=0.0.0.0` ayarlayın ve kaynakları güvenlik duvarıyla sınırlayın; bunun yerine uygulama içinde “Cihaz Bağlantısı”nı açmanız önerilir, çünkü yalnızca gerektiğinde ayrı bir port dinler.
- Yapılandırma, eklentiler ve çalışma alanları varsayılan olarak `data/` altında saklanır. Uzaktan kullanım için SSH tüneli üzerinden erişin:

```sh
ssh -N -L 3000:127.0.0.1:3000 kullanıcı@sunucu-adresi
```

## Model yapılandırma

Ayarlardaki “Model Servisleri” bölümünü açın:

- **Metin modelleri**: OpenAI uyumlu bir sağlayıcı ekleyin; arayüz adresini, API Key'i ve model listesini girin.
- **Görsel / video**: ComfyUI sağlayıcısını kurup yapılandırın; yerel ComfyUI adresini ve iş akışlarını girin.
- **Ses**: Yerel TTS sağlayıcısını kurun; varsayılan adres `http://127.0.0.1:8880/v1` olup `/audio/speech` ile uyumlu herhangi bir servise de yönlendirilebilir.
- **Özel sağlayıcılar**: Herhangi bir üçüncü taraf arayüzünü genişletmek için ayarlardan `.ts` uyarlama dosyaları içe aktarabilirsiniz.

API Key'ler yalnızca yerel veri dizininde saklanır ve yüklenmez.

## Docker

Depo bir [Dockerfile](../../Dockerfile), [Compose yapılandırması](../../compose.yaml) ve [derleme dışlama kuralları](../../.dockerignore) sunar. İmaj Bun 1.4.3 temellidir ve FFmpeg içerir.

```sh
docker compose up -d --build
```

- `http://127.0.0.1:3000` adresine erişin.
- Veriler `toonflowData` adlı named volume içinde saklanır (konteyner içinde `/app/data/` konumuna bağlanır); konteyneri durdurmak veya yeniden oluşturmak veri kaybına yol açmaz, `docker compose down -v` kullanmayın.
- Konteynerdeki servis `0.0.0.0` adresini dinler; erişim kaynaklarını port eşleme veya ters proxy ile kontrol edin.

Sık kullanılan komutlar:

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## Veri ve gizlilik

- Uygulama anonim istatistik veya telemetri verisi toplamaz ve göndermez.
- Projeler, istemler, konuşmalar ve üretilen içerik yerel veri dizininde saklanır.
- İstekler yalnızca bir model sağlayıcısı yapılandırdıktan sonra ilgili arayüze gönderilir; istek içeriği o sağlayıcının hizmet koşullarına tabidir.
- Otomatik güncelleme varsayılan olarak kapalıdır; ayarlardan kendi güncelleme kaynağınızı yapılandırabilirsiniz.

## Açık kaynak lisansı

Carefree, [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) temel alınarak geliştirilmiş bir türev çalışmadır ve [MIT Lisansı](../../LICENSE) altında dağıtılır. Üçüncü taraf bağımlılıklar ve varlıklar kendi lisanslarına ve telif hakkı bildirimlerine tabidir.

## Teşekkürler

Açık kaynak temeli sağlayan Toonflow projesine ve katkıda bulunanlara, ayrıca ComfyUI, Bun, Vue ve Electrobun gibi açık kaynak projelere teşekkür ederiz.
