<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜Kanvas Tanpa Had untuk Drama Pendek & Drama Komik AI

Alat penciptaan AI setempat untuk pencipta drama pendek, drama komik dan video pendek: tulis skrip, pecahkan papan cerita, urus watak dan latar, serta jana imej dan video pada kanvas tanpa had.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree ialah alat penciptaan AI yang berjalan sepenuhnya secara setempat. Projek, aset, perbualan dan hasil penjanaan disimpan pada peranti anda sendiri, dan tiada data penggunaan dilaporkan kepada mana-mana pelayan. Perkhidmatan model anda konfigurasikan sendiri: mana-mana antara muka serasi OpenAI, ComfyUI setempat, serta perkhidmatan TTS setempat atau yang anda hos sendiri.

## Keupayaan

| Keupayaan | Keterangan |
| --- | --- |
| Kanvas tanpa had | Susun skrip, papan cerita, watak, latar dan klip video pada kanvas yang sama, dengan pengelompokan dan sambungan. |
| Penciptaan teks | Sambungkan mana-mana antara muka teks serasi OpenAI, dan tulis skrip, tetapan watak serta penerangan shot dalam nod teks. |
| Penjanaan imej | Jana helaian tiga paparan watak, latar dan imej papan cerita melalui aliran kerja ComfyUI anda sendiri. |
| Penjanaan video | Jana shot video melalui ComfyUI atau antara muka media pihak ketiga, dengan sokongan berbilang aset rujukan dan pembatalan penjanaan. |
| Penjanaan suara | Sambungkan ke antara muka `/audio/speech` serasi OpenAI; TTS yang dipasang secara setempat membolehkan alih suara luar talian. |
| Pengurusan aset | Imej, video dan audio semuanya masuk ke pustaka aset, tempat anda boleh pratonton, susun dan muat turun. |
| Utamakan setempat | Secara lalai perkhidmatan hanya mendengar pada mesin ini; aktifkan sambungan antara peranti apabila perlu untuk berkongsi dalam rangkaian tempatan. |
| Berbilang bahasa | Antara muka menyokong 21 bahasa. |

Model, resolusi, tempoh dan keupayaan audio yang tersedia bergantung pada pembekal dan aliran kerja yang anda konfigurasikan.

### Aliran penciptaan biasa

1. **Skrip dan papan cerita**: Gunakan nod teks untuk menyusun cerita, tetapan watak dan penerangan shot, kemudian ulang selaras dengan model bahasa.
2. **Watak dan latar**: Import imej rujukan, atau cipta watak, latar dan imej papan cerita dengan nod penjanaan imej.
3. **Shot video**: Sambungkan rujukan teks dan imej, pilih model video dan mod penjanaan, kemudian jana shot demi shot.
4. **Pratonton dan eksport**: Pratonton dan susun imej serta klip video pada kanvas, kemudian muat turun aset untuk meneruskan pasca-produksi.

## Memasang klien

| Sistem | Keterangan |
| --- | --- |
| Windows | Jalankan pemasang; ia akan mengesan dan memasang WebView2 secara automatik. Jika aplikasi tertutup serta-merta semasa dibuka selepas pemasangan, pasang [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) secara manual. |
| macOS (Apple Silicon) | Seret Carefree ke “Aplikasi” dan buka terus. Jika dipaparkan bahawa pembangun tidak dapat disahkan, benarkan pembukaan dalam “Tetapan Sistem → Privasi & Keselamatan”. |

Protokol `carefree://` digunakan untuk permulaan semula dan pautan mendalam dalam klien.

## Menjalankan daripada kod sumber

Memerlukan [Bun 1.4.3](https://bun.sh/docs/installation).

```sh
git clone <alamat-repositori-anda> carefree
cd carefree
bun install --frozen-lockfile

# Mod pembangunan: jalankan Web dan Server serentak
bun run dev
```

Buka `http://127.0.0.1:3000`. Pada permulaan pertama, nod, alat dan pemalam terbina dalam akan dimulakan, dan direktori kerja `myProject` dicipta.

### Pembinaan

```sh
# Bina nod, sambungan, Web dan Pelayan
bun run build

# Bina artifak Pelayan kendiri
bun run build:server

# Bina klien desktop
bun run build:desktop
bun run package:desktop
```

Pakej pemasang Windows tidak ditandatangani secara lalai. Tetapkan pemboleh ubah persekitaran berikut sebelum menerbitkan, dan `bun run build:desktop` / `bun run package:desktop` akan menandatangani serta mengesahkan secara automatik empat pelancar (`startupLauncher.exe`, `protocolLauncher.exe`, `saveFileDialog.exe`, `updateHelper.exe`), program bantu pemasang (`checkWebView2.exe`, `checkRunning.exe`) dan `Setup.exe` akhir dengan `signtool`:

| Pemboleh ubah | Keterangan |
| --- | --- |
| `CAREFREE_SIGN_PFX` | Laluan mutlak sijil `.pfx`; tandatangan dilangkau jika tidak ditetapkan |
| `CAREFREE_SIGN_PASSWORD` | Kata laluan sijil; biarkan kosong jika sijil tidak disulitkan |
| `CAREFREE_SIGN_TIMESTAMP_URL` | Perkhidmatan cap masa RFC3161, lalai `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | Laluan `signtool.exe`; secara lalai dicari secara automatik dalam Windows SDK |

Persekitaran Windows x64 dan Windows SDK diperlukan. Program utama aplikasi berada di dalam tar kemas kini inkremental dan tidak termasuk dalam skop tandatangan ini; jika perlu ditandatangani, tandatangani fail aplikasi terlebih dahulu, kemudian jana semula tar dan manifes kemas kini.

Di GitHub Actions, sijil disediakan melalui Secrets repositori; selepas dikonfigurasikan, binaan Windows akan ditandatangani dan disahkan secara automatik:

| Secret | Keterangan |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | Teks Base64 fail sijil `.pfx`; CI melangkau tandatangan jika tidak ditetapkan |
| `CAREFREE_SIGN_PASSWORD` | Kata laluan eksport PFX; biarkan kosong jika tidak disulitkan |

Sijil hanya ditulis ke cakera sementara semasa langkah pembinaan dan dibersihkan apabila tugas tamat. Alamat cap masa boleh diubah melalui pemboleh ubah persekitaran `CAREFREE_SIGN_TIMESTAMP_URL`.

### Pelayan

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- Mendengar `127.0.0.1:3000` secara lalai dan tidak terdedah kepada internet awam.
- Port boleh diubah melalui `TOONFLOW_SERVER_PORT`.
- Jika akses rangkaian tempatan benar-benar diperlukan, tetapkan `TOONFLOW_SERVER_HOST=0.0.0.0` dan hadkan sumber dengan tembok api; lebih disyorkan untuk mengaktifkan “Sambungan Peranti” dalam aplikasi, yang hanya mendengar port berasingan apabila perlu.
- Konfigurasi, pemalam dan ruang kerja disimpan dalam `data/` secara lalai. Untuk penggunaan jauh, akses melalui terowong SSH:

```sh
ssh -N -L 3000:127.0.0.1:3000 pengguna@alamat-pelayan
```

## Mengkonfigurasi model

Buka “Perkhidmatan Model” dalam tetapan:

- **Model teks**: Tambah pembekal serasi OpenAI, dan isi alamat antara muka, API Key dan senarai model.
- **Imej / video**: Pasang dan konfigurasikan pembekal ComfyUI, isi alamat ComfyUI setempat dan aliran kerja.
- **Suara**: Pasang pembekal TTS setempat; alamat lalainya `http://127.0.0.1:8880/v1`, dan boleh dihalakan ke mana-mana perkhidmatan yang serasi dengan `/audio/speech`.
- **Pembekal tersuai**: Import fail penyesuai `.ts` dalam tetapan untuk meluaskan mana-mana antara muka pihak ketiga.

API Key hanya disimpan dalam direktori data setempat dan tidak dimuat naik.

## Docker

Repositori menyediakan [Dockerfile](../../Dockerfile), [konfigurasi Compose](../../compose.yaml) dan [peraturan pengecualian pembinaan](../../.dockerignore). Imej berdasarkan Bun 1.4.3 dan mengandungi FFmpeg.

```sh
docker compose up -d --build
```

- Akses `http://127.0.0.1:3000`.
- Data disimpan dalam named volume `toonflowData` (dipasang di `/app/data/` dalam kontena); menghentikan atau membina semula kontena tidak menghilangkan data, jadi jangan gunakan `docker compose down -v`.
- Perkhidmatan dalam kontena mendengar `0.0.0.0`; kawal sumber akses dengan pemetaan port atau proksi terbalik.

Perintah biasa:

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## Data dan privasi

- Aplikasi tidak mengumpul atau melaporkan statistik tanpa nama atau data telemetri.
- Projek, gesaan, perbualan dan kandungan janaan disimpan dalam direktori data setempat.
- Permintaan hanya dihantar ke antara muka berkaitan selepas anda mengkonfigurasi pembekal model; kandungan permintaan tertakluk pada terma perkhidmatan pembekal tersebut.
- Kemas kini automatik dimatikan secara lalai; anda boleh mengkonfigurasi sumber kemas kini sendiri dalam tetapan.

## Lesen sumber terbuka

Carefree dibangunkan sebagai karya terbitan berdasarkan [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) dan diedarkan di bawah [Lesen MIT](../../LICENSE). Kebergantungan dan aset pihak ketiga tertakluk pada lesen dan notis hak cipta masing-masing.

## Penghargaan

Terima kasih kepada projek Toonflow dan para penyumbangnya atas asas sumber terbuka, serta projek sumber terbuka seperti ComfyUI, Bun, Vue dan Electrobun.
