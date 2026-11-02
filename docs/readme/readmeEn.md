<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜Infinite Canvas for AI Short Dramas & Comic Dramas

A local AI creation tool for short-drama, comic-drama and short-video creators: write scripts, break down storyboards, manage characters and scenes, and generate images and videos on an infinite canvas.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree is a fully local AI creation tool. Projects, assets, conversations and generated results are stored on your own device, and no usage data is reported to any server. You configure the model services yourself: any OpenAI-compatible endpoint, a local ComfyUI instance, and a local or self-hosted TTS service.

## Features

| Capability | Description |
| --- | --- |
| Infinite canvas | Organize scripts, storyboards, characters, scenes and video clips on the same canvas, with grouping and connections. |
| Text creation | Connect any OpenAI-compatible text endpoint and write scripts, character settings and shot descriptions in text nodes. |
| Image generation | Generate character turnaround sheets, scenes and storyboard images through self-hosted ComfyUI workflows. |
| Video generation | Generate video shots through ComfyUI or third-party media endpoints, with multiple reference assets and cancelable generation. |
| Voice generation | Connect to the OpenAI-compatible `/audio/speech` endpoint; a locally deployed TTS service enables offline dubbing. |
| Asset management | Images, videos and audio all go into the asset library, where you can preview, organize and download them. |
| Local first | By default the service only listens on this machine; enable device interconnection to share over a local network when needed. |
| Multilingual | The interface supports 21 languages. |

The models, resolutions, durations and audio capabilities available depend on the providers and workflows you configure.

### Typical creation workflow

1. **Script and storyboard**: Use text nodes to organize the story, character settings and shot descriptions, iterating with a language model.
2. **Characters and scenes**: Import reference images, or create characters, scenes and storyboard images with image generation nodes.
3. **Video shots**: Connect text and image references, choose a video model and generation mode, and generate shot by shot.
4. **Preview and export**: Preview and organize images and video clips on the canvas, then download assets for post-production.

## Installing the client

| System | Description |
| --- | --- |
| Windows | Run the installer; it automatically detects and installs WebView2. If the app crashes on launch after installation, install [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) manually. |
| macOS (Apple Silicon) | Drag Carefree into Applications and open it directly. If macOS says the developer cannot be verified, allow it in System Settings → Privacy & Security. |

The `carefree://` URL scheme is used for in-app restarts and deep links.

## Running from source

Requires [Bun 1.4.3](https://bun.sh/docs/installation).

```sh
git clone <your-repository-url> carefree
cd carefree
bun install --frozen-lockfile

# Development mode: start Web and Server together
bun run dev
```

Open `http://127.0.0.1:3000`. The first launch initializes the built-in nodes, tools and plugins, and creates the `myProject` working directory.

### Building

```sh
# Build nodes, extensions, Web and Server
bun run build

# Build standalone Server artifacts
bun run build:server

# Build desktop client
bun run build:desktop
bun run package:desktop
```

Windows installers are unsigned by default. Set the following environment variables before publishing, and `bun run build:desktop` / `bun run package:desktop` will automatically sign and verify the four launchers (`startupLauncher.exe`, `protocolLauncher.exe`, `saveFileDialog.exe`, `updateHelper.exe`), the installer helpers (`checkWebView2.exe`, `checkRunning.exe`) and the final `Setup.exe` with `signtool`:

| Variable | Description |
| --- | --- |
| `CAREFREE_SIGN_PFX` | Absolute path to the `.pfx` certificate; signing is skipped when unset |
| `CAREFREE_SIGN_PASSWORD` | Certificate password; leave empty if the certificate is not encrypted |
| `CAREFREE_SIGN_TIMESTAMP_URL` | RFC3161 timestamp service, defaults to `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | Path to `signtool.exe`; by default it is located automatically from the Windows SDK |

Windows x64 and the Windows SDK are required. The application's main executable lives inside the incremental update tar and is not covered by this signing step; to sign it, sign the application file first, then regenerate the tar and update manifest.

In GitHub Actions, provide the certificate through repository Secrets. Once configured, Windows builds are signed and verified automatically:

| Secret | Description |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | Base64 text of the `.pfx` certificate file; CI skips signing when not configured |
| `CAREFREE_SIGN_PASSWORD` | PFX export password; leave empty if not encrypted |

The certificate is written to disk only for the duration of the build step and removed when the job ends. The timestamp URL can be overridden with the `CAREFREE_SIGN_TIMESTAMP_URL` environment variable.

### Server

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- Listens on `127.0.0.1:3000` by default and is not exposed to the public internet.
- The port can be changed with `TOONFLOW_SERVER_PORT`.
- If LAN access is really needed, set `TOONFLOW_SERVER_HOST=0.0.0.0` and restrict sources with a firewall; enabling “Device Interconnection” in the app is recommended instead, as it only listens on a separate port when needed.
- Configuration, plugins and workspaces are stored in `data/` by default. For remote use, access through an SSH tunnel:

```sh
ssh -N -L 3000:127.0.0.1:3000 user@server-address
```

## Configuring models

Open “Model Services” in settings:

- **Text models**: Add an OpenAI-compatible provider and fill in the endpoint URL, API Key and model list.
- **Image / Video**: Install and configure a ComfyUI provider, entering the local ComfyUI address and workflows.
- **Speech**: Install a local TTS provider; the default address is `http://127.0.0.1:8880/v1`, and it can also point to any service compatible with `/audio/speech`.
- **Custom providers**: Import `.ts` adapter files in settings to extend any third-party endpoint.

API Keys are stored only in the local data directory and are never uploaded.

## Docker

The repository provides a [Dockerfile](../../Dockerfile), [Compose configuration](../../compose.yaml) and [build ignore rules](../../.dockerignore). The image is based on Bun 1.4.3 and bundles FFmpeg.

```sh
docker compose up -d --build
```

- Access `http://127.0.0.1:3000`.
- Data is stored in the named volume `toonflowData` (mounted at `/app/data/` inside the container); stopping or recreating the container does not lose data, so do not use `docker compose down -v`.
- The service in the container listens on `0.0.0.0`; control access sources with port mapping or a reverse proxy.

Common commands:

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## Data and privacy

- The app does not collect or report anonymous statistics or telemetry.
- Projects, prompts, conversations and generated content are stored in the local data directory.
- Requests are sent to the corresponding endpoint only after you configure a model provider; the request content is governed by that provider's terms of service.
- Automatic updates are disabled by default; you can configure a self-hosted update source in settings.

## License

Carefree is a derivative work based on [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) and is released under the [MIT License](../../LICENSE). Third-party dependencies and assets remain subject to their respective licenses and copyright notices.

## Acknowledgements

Thanks to the Toonflow project and its contributors for the open-source foundation, as well as to open-source projects such as ComfyUI, Bun, Vue and Electrobun.
