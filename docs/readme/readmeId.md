<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜Kanvas Tanpa Batas untuk Drama Pendek & Drama Komik AI

Alat kreasi AI lokal untuk pembuat drama pendek, drama komik dan video pendek: menulis naskah, memecah storyboard, mengelola karakter dan latar, serta menghasilkan gambar dan video di kanvas tanpa batas.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree adalah alat kreasi AI yang berjalan sepenuhnya secara lokal. Proyek, aset, percakapan dan hasil generasi disimpan di perangkat Anda sendiri, dan tidak ada data penggunaan yang dilaporkan ke server mana pun. Layanan model Anda konfigurasikan sendiri: antarmuka apa pun yang kompatibel dengan OpenAI, ComfyUI lokal, serta layanan TTS lokal yang Anda hos sendiri.

## Kemampuan

| Kemampuan | Keterangan |
| --- | --- |
| Kanvas tanpa batas | Atur naskah, storyboard, karakter, latar dan klip video pada kanvas yang sama, dengan pengelompokan dan koneksi. |
| Kreasi teks | Hubungkan antarmuka teks apa pun yang kompatibel dengan OpenAI, lalu tulis naskah, deskripsi karakter dan deskripsi shot di node teks. |
| Pembuatan gambar | Hasilkan lembar tiga tampilan karakter, latar dan gambar storyboard melalui alur kerja ComfyUI Anda sendiri. |
| Pembuatan video | Hasilkan shot video melalui ComfyUI atau antarmuka media pihak ketiga, dengan dukungan beberapa aset referensi dan pembatalan generasi. |
| Pembuatan suara | Hubungkan ke antarmuka `/audio/speech` yang kompatibel dengan OpenAI; TTS yang dipasang secara lokal memungkinkan sulih suara offline. |
| Pengelolaan aset | Gambar, video dan audio semuanya masuk ke pustaka aset, tempat Anda dapat melihat pratinjau, menata dan mengunduhnya. |
| Utamakan lokal | Secara bawaan layanan hanya mendengarkan di mesin ini; aktifkan koneksi antarperangkat bila perlu untuk berbagi di jaringan lokal. |
| Multibahasa | Antarmuka mendukung 21 bahasa. |

Model, resolusi, durasi dan kemampuan audio yang tersedia bergantung pada penyedia dan alur kerja yang Anda konfigurasikan.

### Alur kreasi umum

1. **Naskah dan storyboard**: Gunakan node teks untuk menata cerita, deskripsi karakter dan deskripsi shot, lalu iterasi dengan model bahasa.
2. **Karakter dan latar**: Impor gambar referensi, atau buat karakter, latar dan gambar storyboard dengan node pembuatan gambar.
3. **Shot video**: Hubungkan referensi teks dan gambar, pilih model video dan mode generasi, lalu hasilkan shot demi shot.
4. **Pratinjau dan ekspor**: Pratinjau dan tata gambar serta klip video di kanvas, lalu unduh aset untuk melanjutkan pascaproduksi.

## Memasang klien

| Sistem | Keterangan |
| --- | --- |
| Windows | Jalankan penginstal; penginstal akan mendeteksi dan memasang WebView2 secara otomatis. Jika aplikasi langsung tertutup saat dibuka setelah pemasangan, pasang [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) secara manual. |
| macOS (Apple Silicon) | Seret Carefree ke “Aplikasi” lalu buka langsung. Jika muncul pesan bahwa pengembang tidak dapat diverifikasi, izinkan pembukaan di “Pengaturan Sistem → Privasi & Keamanan”. |

Protokol `carefree://` digunakan untuk memulai ulang dan membuka tautan mendalam di dalam klien.

## Menjalankan dari kode sumber

Memerlukan [Bun 1.4.3](https://bun.sh/docs/installation).

```sh
git clone <alamat-repositori-anda> carefree
cd carefree
bun install --frozen-lockfile

# Mode pengembangan: jalankan Web dan Server sekaligus
bun run dev
```

Buka `http://127.0.0.1:3000`. Saat pertama kali dijalankan, node, alat dan plugin bawaan akan diinisialisasi, serta direktori kerja `myProject` dibuat.

### Build

```sh
# Build node, ekstensi, Web dan Server
bun run build

# Build artefak Server mandiri
bun run build:server

# Build klien desktop
bun run build:desktop
bun run package:desktop
```

Paket instalasi Windows tidak ditandatangani secara bawaan. Atur variabel lingkungan berikut sebelum merilis, dan `bun run build:desktop` / `bun run package:desktop` akan otomatis menandatangani serta memverifikasi empat peluncur (`startupLauncher.exe`, `protocolLauncher.exe`, `saveFileDialog.exe`, `updateHelper.exe`), program bantu penginstal (`checkWebView2.exe`, `checkRunning.exe`) dan `Setup.exe` final dengan `signtool`:

| Variabel | Keterangan |
| --- | --- |
| `CAREFREE_SIGN_PFX` | Path absolut sertifikat `.pfx`; penandatanganan dilewati jika tidak diatur |
| `CAREFREE_SIGN_PASSWORD` | Kata sandi sertifikat; biarkan kosong jika sertifikat tidak terenkripsi |
| `CAREFREE_SIGN_TIMESTAMP_URL` | Layanan stempel waktu RFC3161, bawaan `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | Path `signtool.exe`; secara bawaan dicari otomatis di Windows SDK |

Diperlukan lingkungan Windows x64 dan Windows SDK. Program utama aplikasi berada di dalam tar pembaruan inkremental dan tidak termasuk dalam cakupan penandatanganan ini; jika perlu ditandatangani, tandatangani dulu berkas aplikasi, lalu hasilkan ulang tar dan manifes pembaruan.

Di GitHub Actions, sertifikat disediakan melalui Secrets repositori; setelah dikonfigurasi, build Windows akan ditandatangani dan diverifikasi secara otomatis:

| Secret | Keterangan |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | Teks Base64 berkas sertifikat `.pfx`; CI melewati penandatanganan jika tidak diatur |
| `CAREFREE_SIGN_PASSWORD` | Kata sandi ekspor PFX; biarkan kosong jika tidak terenkripsi |

Sertifikat hanya ditulis ke disk sementara selama langkah build dan dibersihkan saat tugas selesai. Alamat stempel waktu dapat ditimpa dengan variabel lingkungan `CAREFREE_SIGN_TIMESTAMP_URL`.

### Server

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- Mendengarkan `127.0.0.1:3000` secara bawaan dan tidak terbuka ke internet publik.
- Port dapat diubah melalui `TOONFLOW_SERVER_PORT`.
- Jika akses jaringan lokal benar-benar diperlukan, atur `TOONFLOW_SERVER_HOST=0.0.0.0` dan batasi sumber dengan firewall; sebaiknya aktifkan “Koneksi Perangkat” di dalam aplikasi, yang hanya mendengarkan port terpisah saat diperlukan.
- Konfigurasi, plugin dan ruang kerja disimpan di `data/` secara bawaan. Untuk penggunaan jarak jauh, akses melalui terowong SSH:

```sh
ssh -N -L 3000:127.0.0.1:3000 pengguna@alamat-server
```

## Mengonfigurasi model

Buka “Layanan Model” di pengaturan:

- **Model teks**: Tambahkan penyedia yang kompatibel dengan OpenAI, lalu isi alamat antarmuka, API Key dan daftar model.
- **Gambar / video**: Pasang dan konfigurasikan penyedia ComfyUI, isi alamat ComfyUI lokal dan alur kerja.
- **Suara**: Pasang penyedia TTS lokal; alamat bawaannya `http://127.0.0.1:8880/v1`, dan dapat diarahkan ke layanan apa pun yang kompatibel dengan `/audio/speech`.
- **Penyedia kustom**: Impor berkas adaptor `.ts` di pengaturan untuk memperluas antarmuka pihak ketiga mana pun.

API Key hanya disimpan di direktori data lokal dan tidak diunggah.

## Docker

Repositori menyediakan [Dockerfile](../../Dockerfile), [konfigurasi Compose](../../compose.yaml) dan [aturan pengecualian build](../../.dockerignore). Image berbasis Bun 1.4.3 dan menyertakan FFmpeg.

```sh
docker compose up -d --build
```

- Akses `http://127.0.0.1:3000`.
- Data disimpan dalam named volume `toonflowData` (dipasang di `/app/data/` di dalam kontainer); menghentikan atau membuat ulang kontainer tidak menghilangkan data, jadi jangan gunakan `docker compose down -v`.
- Layanan di dalam kontainer mendengarkan `0.0.0.0`; kendalikan sumber akses dengan pemetaan port atau reverse proxy.

Perintah umum:

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## Data dan privasi

- Aplikasi tidak mengumpulkan atau melaporkan statistik anonim maupun data telemetri.
- Proyek, prompt, percakapan dan konten hasil generasi disimpan di direktori data lokal.
- Permintaan hanya dikirim ke antarmuka terkait setelah Anda mengonfigurasi penyedia model; isi permintaan tunduk pada ketentuan layanan penyedia tersebut.
- Pembaruan otomatis nonaktif secara bawaan; Anda dapat mengonfigurasi sumber pembaruan sendiri di pengaturan.

## Lisensi sumber terbuka

Carefree dikembangkan turunan dari [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) dan dirilis di bawah [Lisensi MIT](../../LICENSE). Dependensi dan aset pihak ketiga tunduk pada lisensi dan pemberitahuan hak cipta masing-masing.

## Ucapan terima kasih

Terima kasih kepada proyek Toonflow dan para kontributornya atas fondasi sumber terbuka, serta proyek sumber terbuka seperti ComfyUI, Bun, Vue dan Electrobun.
