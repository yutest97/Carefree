<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜Walang-hanggang canvas ng AI para sa short drama at comic drama

Isang lokal na AI tool sa paglikha para sa mga gumagawa ng short drama, comic drama at maiikling video: magsulat ng script, hatiin ang mga shot, pamahalaan ang mga karakter at eksena, at bumuo ng larawan at video sa isang walang-hanggang canvas.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Ang Carefree ay isang AI creation tool na ganap na tumatakbo nang lokal. Ang mga proyekto, materyales, usapan at nabuong resulta ay nakaimbak sa sarili mong device, at walang data ng paggamit na ipinapadala sa anumang server. Ikaw mismo ang nag-configure ng model service: anumang OpenAI-compatible na interface, lokal na ComfyUI, at lokal o self-hosted na TTS service.

## Mga kakayahan

| Kakayahan | Paliwanag |
| --- | --- |
| Walang-hanggang canvas | Isaayos ang script, storyboard, karakter, eksena at video clip sa isang canvas, may grouping at koneksyon. |
| Paglikha ng teksto | Kumonekta sa anumang OpenAI-compatible na text interface at magsulat ng script, character setting at shot description sa text node. |
| Pagbuo ng larawan | Bumuo ng character three-view, eksena at storyboard image sa pamamagitan ng self-hosted ComfyUI workflow. |
| Pagbuo ng video | Bumuo ng video shot sa pamamagitan ng ComfyUI o third-party media interface, may maraming reference material at kakayahang kanselahin ang generation. |
| Pagbuo ng boses | Kumonekta sa OpenAI-compatible na `/audio/speech` interface; offline na dubbing kapag lokal na naka-deploy ang TTS. |
| Pamamahala ng materyales | Ang larawan, video at audio ay pumapasok sa isang material library, may preview, pagsasaayos at pag-download. |
| Lokal muna | Sa default, sa lokal na machine lang nakikinig ang service; kapag binuksan ang device interconnection, maaaring ibahagi sa LAN. |
| Maraming wika | Sinusuportahan ng interface ang 21 wika. |

Ang aktuwal na magagamit na modelo, resolution, tagal at kakayahan sa audio ay nakasalalay sa provider at workflow na ini-configure mo.

### Karaniwang workflow ng paglikha

1. **Script at storyboard**: Ayusin ang kuwento, character setting at shot description gamit ang text node, at paulit-ulit na pagbutihin gamit ang language model.
2. **Karakter at eksena**: Mag-import ng reference image, o gumawa ng karakter, eksena at storyboard image gamit ang image generation node.
3. **Video shot**: Ikonekta ang text at image reference, pumili ng video model at generation mode, at bumuo nang pa-shot.
4. **Preview at export**: I-preview at ayusin ang larawan at video clip sa canvas, i-download ang materyales para sa susunod na post-production.

## I-install ang client

| System | Paliwanag |
| --- | --- |
| Windows | Patakbuhin ang installer; awtomatikong matukoy at mai-install ng installer ang WebView2. Kung mag-crash ito pagkatapos i-install, mano-manong i-install ang [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/). |
| macOS (Apple Silicon) | I-drag ang Carefree sa "Applications" at buksan ito direkta. Kung may babalang hindi ma-verify ang developer, pahintulutan itong buksan sa "System Settings → Privacy & Security". |

Ang ginagamit na protocol ay `carefree://`, para sa restart at deep link navigation sa loob ng client.

## Patakbuhin mula sa source

Kailangan ang [Bun 1.4.3](https://bun.sh/docs/installation).

```sh
git clone <url ng iyong repository> carefree
cd carefree
bun install --frozen-lockfile

# Development mode: sabay na simulan ang Web at Server
bun run dev
```

Buksan ang `http://127.0.0.1:3000`. Sa unang pag-start, ini-initialize ang mga built-in node, tool at plugin, at gumagawa ng `myProject` working directory.

### Build

```sh
# Build ng mga node, extension, Web at Server
bun run build

# Build ng standalone na Server artifact
bun run build:server

# Build ng desktop client
bun run build:desktop
bun run package:desktop
```

Sa default, hindi naka-sign ang Windows installer. Bago mag-release, itakda ang mga environment variable sa ibaba, at awtomatikong pipirmahan at i-verify ng `bun run build:desktop` / `bun run package:desktop` ang apat na launcher (`startupLauncher.exe`, `protocolLauncher.exe`, `saveFileDialog.exe`, `updateHelper.exe`), ang installer helper program (`checkWebView2.exe`, `checkRunning.exe`) at ang final na `Setup.exe` gamit ang `signtool`:

| Variable | Paliwanag |
| --- | --- |
| `CAREFREE_SIGN_PFX` | Absolute path ng `.pfx` certificate; nilalaktawan ang signing kapag hindi nakatakda |
| `CAREFREE_SIGN_PASSWORD` | Password ng certificate; iwanang blangko kung hindi naka-encrypt |
| `CAREFREE_SIGN_TIMESTAMP_URL` | RFC3161 timestamp service, default ay `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | Path ng `signtool.exe`, awtomatikong hinahanap mula sa Windows SDK sa default |

Kailangan ng Windows x64 environment at Windows SDK. Ang pangunahing application program ay nasa incremental update tar, wala sa saklaw ng signing na ito; kung kailangang i-sign, i-sign muna ang application file bago muling buuin ang tar at update manifest.

Sa GitHub Actions, gamitin ang repository Secrets para magbigay ng certificate; kapag naka-configure, awtomatikong pipirmahan at i-verify ang Windows build:

| Secret | Paliwanag |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | Base64 na teksto ng `.pfx` certificate file; nilalaktawan ng CI ang signing kapag hindi naka-configure |
| `CAREFREE_SIGN_PASSWORD` | PFX export password; iwanang blangko kung hindi naka-encrypt |

Ang certificate ay pansamantalang nakaimbak sa disk sa build step lamang, at nililinis pagkatapos ng task. Maaaring i-override ang timestamp address gamit ang `CAREFREE_SIGN_TIMESTAMP_URL` environment variable.

### Server

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- Sa default, nakikinig ito sa `127.0.0.1:3000` at hindi nakabukas sa external network.
- Maaaring baguhin ang port gamit ang `TOONFLOW_SERVER_PORT`.
- Kung talagang kailangan ng LAN access, itakda ang `TOONFLOW_SERVER_HOST=0.0.0.0`, at ikaw mismo ang maglimita ng source gamit ang firewall; mas inirerekomenda ang pagbubukas ng "Device interconnection" sa app, dahil nakikinig lang ito sa hiwalay na port kapag kailangan.
- Sa default, ang config, plugin at workspace ay nakaimbak sa `data/`. Kapag remote, maaaring ma-access sa SSH tunnel:

```sh
ssh -N -L 3000:127.0.0.1:3000 user@server-address
```

## I-configure ang mga modelo

Buksan ang "Model service" sa settings:

- **Text model**: Magdagdag ng OpenAI-compatible provider, punan ang interface address, API Key at model list.
- **Larawan / Video**: I-install at i-configure ang ComfyUI provider, punan ang local ComfyUI address at workflow.
- **Boses**: I-install ang local TTS provider, ang default address ay `http://127.0.0.1:8880/v1`, at maaaring ituro sa anumang service na compatible sa `/audio/speech`.
- **Custom provider**: Maaaring mag-import ng `.ts` adapter file sa settings para palawakin ang anumang third-party interface.

Ang API Key ay nakaimbak lamang sa local data directory at hindi ipinapadala.

## Docker

Ang repository ay nagbibigay ng [Dockerfile](../../Dockerfile), [Compose configuration](../../compose.yaml) at [build exclusion rules](../../.dockerignore); ang image ay batay sa Bun 1.4.3 at may built-in na FFmpeg.

```sh
docker compose up -d --build
```

- I-access ang `http://127.0.0.1:3000`.
- Ang data ay nakaimbak sa named volume `toonflowData` (naka-mount sa `/app/data/` sa loob ng container); hindi mawawala ang data kapag hininto o muling binuo ang container, kaya huwag gamitin ang `docker compose down -v`.
- Ang service sa loob ng container ay nakikinig sa `0.0.0.0`; kontrolin ang access source gamit ang port mapping o reverse proxy.

Karaniwang mga command:

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## Data at privacy

- Hindi nangongolekta o nag-uulat ang app ng anonymous statistics o telemetry data.
- Ang mga proyekto, prompt, usapan at nilikhang content ay nakaimbak sa local data directory.
- Magpapadala lang ito ng request sa kaukulang interface kapag nag-configure ka ng model provider; ang nilalaman ng request ay saklaw ng terms of service ng provider.
- Naka-off sa default ang auto update, at maaaring i-configure ang self-hosted update source sa settings.

## Open source license

Ang Carefree ay batay sa [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) at karagdagang pag-develop, at sumusunod sa [MIT License](../../LICENSE). Ang mga third-party dependency at materyales ay sumusunod sa kani-kanilang license at copyright notice.

## Pasasalamat

Salamat sa Toonflow project at sa mga contributor nito para sa open source foundation, gayundin sa mga open source project tulad ng ComfyUI, Bun, Vue at Electrobun.
