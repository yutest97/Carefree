<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜AI 숏드라마·웹툰 드라마 무한 캔버스

숏드라마, 웹툰 드라마, 숏폼 영상 크리에이터를 위한 로컬 AI 제작 도구입니다. 무한 캔버스에서 대본을 쓰고 콘티를 나누며, 캐릭터와 장면을 관리하고 이미지와 영상을 생성합니다.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree는 완전히 로컬에서 실행되는 AI 제작 도구입니다. 프로젝트, 소재, 대화, 생성 결과는 모두 사용자의 기기에 저장되며 어떤 서버에도 사용 데이터를 전송하지 않습니다. 모델 서비스는 직접 설정합니다. 임의의 OpenAI 호환 API, 로컬 ComfyUI, 그리고 로컬 또는 자체 구축한 TTS 서비스를 사용할 수 있습니다.

## 기능

| 기능 | 설명 |
| --- | --- |
| 무한 캔버스 | 하나의 캔버스에서 대본, 콘티, 캐릭터, 장면, 영상 클립을 정리하며 그룹화와 연결을 지원합니다. |
| 텍스트 창작 | 임의의 OpenAI 호환 텍스트 API에 연결해 텍스트 노드에서 대본, 인물 설정, 샷 묘사를 작성합니다. |
| 이미지 생성 | 자체 구축한 ComfyUI 워크플로로 캐릭터 턴어라운드, 장면, 콘티 이미지를 생성합니다. |
| 영상 생성 | ComfyUI 또는 타사 미디어 API로 영상 샷을 생성하며, 여러 참고 소재와 생성 취소를 지원합니다. |
| 음성 생성 | OpenAI 호환 `/audio/speech` API에 연결합니다. 로컬에 TTS를 배포하면 오프라인으로 더빙할 수 있습니다. |
| 소재 관리 | 이미지, 영상, 오디오를 소재 라이브러리에 모아 두고 미리 보기, 정리, 다운로드를 지원합니다. |
| 로컬 우선 | 기본적으로 기기에서만 수신하며, 필요할 때 기기 연결을 켜면 LAN에서 공유할 수 있습니다. |
| 다국어 | UI가 21개 언어를 지원합니다. |

사용 가능한 모델, 해상도, 재생 시간, 오디오 기능은 설정한 공급자와 워크플로에 따라 달라집니다.

### 일반적인 제작 흐름

1. **대본과 콘티**:텍스트 노드로 이야기, 인물 설정, 샷 묘사를 정리하고 언어 모델로 반복해서 다듬습니다.
2. **캐릭터와 장면**:참고 이미지를 가져오거나 이미지 생성 노드로 캐릭터, 장면, 콘티 이미지를 만듭니다.
3. **영상 샷**:텍스트와 이미지 참고를 연결하고 영상 모델과 생성 모드를 선택해 샷 단위로 생성합니다.
4. **미리 보기와 내보내기**:캔버스에서 이미지와 영상 클립을 미리 보고 정리한 뒤, 소재를 다운로드해 후반 작업을 이어갑니다.

## 클라이언트 설치

| 시스템 | 설명 |
| --- | --- |
| Windows | 설치 패키지를 실행하면 설치 프로그램이 WebView2를 자동으로 감지해 설치합니다. 설치 후 실행이 바로 종료된다면 [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)을 수동으로 설치하세요. |
| macOS(Apple Silicon) | Carefree를 "응용 프로그램"으로 끌어다 놓은 뒤 바로 엽니다. 개발자를 확인할 수 없다는 메시지가 나오면 "시스템 설정 → 개인정보 보호 및 보안"에서 열기를 허용하세요. |

의존 프로토콜은 `carefree://`이며, 클라이언트 내 재시작과 딥 링크 이동에 사용됩니다.

## 소스에서 실행

[Bun 1.4.3](https://bun.sh/docs/installation)이 필요합니다.

```sh
git clone <저장소 URL> carefree
cd carefree
bun install --frozen-lockfile

# 개발 모드: Web과 Server를 동시에 실행
bun run dev
```

`http://127.0.0.1:3000`을 엽니다. 첫 실행 시 내장 노드, 도구, 플러그인이 초기화되고 `myProject` 작업 디렉터리가 생성됩니다.

### 빌드

```sh
# 노드, 확장, Web, Server 빌드
bun run build

# 단독 Server 산출물 빌드
bun run build:server

# 데스크톱 클라이언트 빌드
bun run build:desktop
bun run package:desktop
```

Windows 설치 패키지는 기본적으로 서명되지 않습니다. 배포 전에 아래 환경 변수를 설정하면 `bun run build:desktop` / `bun run package:desktop`이 `signtool`로 네 개의 런처(`startupLauncher.exe`, `protocolLauncher.exe`, `saveFileDialog.exe`, `updateHelper.exe`), 설치 프로그램 보조 프로그램(`checkWebView2.exe`, `checkRunning.exe`), 최종 `Setup.exe`에 서명하고 서명을 검증합니다:

| 변수 | 설명 |
| --- | --- |
| `CAREFREE_SIGN_PFX` | `.pfx` 인증서의 절대 경로, 설정하지 않으면 서명을 건너뜁니다 |
| `CAREFREE_SIGN_PASSWORD` | 인증서 비밀번호, 인증서가 암호화되지 않았으면 비워 둡니다 |
| `CAREFREE_SIGN_TIMESTAMP_URL` | RFC3161 타임스탬프 서비스, 기본값은 `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | `signtool.exe` 경로, 기본값은 Windows SDK에서 자동으로 찾습니다 |

Windows x64 환경과 Windows SDK가 필요합니다. 앱 본체는 증분 업데이트용 tar 안에 있어 이번 서명 범위에 포함되지 않습니다. 서명이 필요하다면 먼저 앱 파일에 서명한 뒤 tar와 업데이트 매니페스트를 다시 생성하세요.

GitHub Actions에서는 저장소 Secrets로 인증서를 제공합니다. 설정하면 Windows 빌드가 자동으로 서명하고 검증합니다:

| Secret | 설명 |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | `.pfx` 인증서 파일의 Base64 텍스트, 설정하지 않으면 CI가 서명을 건너뜁니다 |
| `CAREFREE_SIGN_PASSWORD` | PFX 내보내기 비밀번호, 암호화되지 않았으면 비워 둡니다 |

인증서는 빌드 단계에서만 임시로 디스크에 기록되며 작업이 끝나면 정리됩니다. 타임스탬프 주소는 `CAREFREE_SIGN_TIMESTAMP_URL` 환경 변수로 덮어쓸 수 있습니다.

### 서버

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- 기본적으로 `127.0.0.1:3000`에서 수신하며 외부에 공개하지 않습니다.
- 포트는 `TOONFLOW_SERVER_PORT`로 변경할 수 있습니다.
- 꼭 LAN에서 접근해야 한다면 `TOONFLOW_SERVER_HOST=0.0.0.0`을 설정하고 방화벽으로 접속 출처를 직접 제한하세요. 앱 안에서 "기기 연결"을 켜는 방법이 더 권장되며, 필요할 때만 별도 포트에서 수신합니다.
- 설정, 플러그인, 작업 공간은 기본적으로 `data/`에 저장됩니다. 원격에서 사용할 때는 SSH 터널로 접속할 수 있습니다:

```sh
ssh -N -L 3000:127.0.0.1:3000 사용자이름@서버주소
```

## 모델 설정

설정의 "모델 서비스"를 엽니다:

- **텍스트 모델**: OpenAI 호환 공급자를 추가하고 API 주소, API Key, 모델 목록을 입력합니다.
- **이미지 / 영상**: ComfyUI 공급자를 설치하고 설정하며, 로컬 ComfyUI 주소와 워크플로를 입력합니다.
- **음성**: 로컬 TTS 공급자를 설치합니다. 기본 주소는 `http://127.0.0.1:8880/v1`이며, `/audio/speech`를 지원하는 다른 서비스도 지정할 수 있습니다.
- **사용자 정의 공급자**: 설정에서 `.ts` 어댑터 파일을 가져와 임의의 타사 API를 확장할 수 있습니다.

API Key는 로컬 데이터 디렉터리에만 저장되며 업로드되지 않습니다.

## Docker

저장소에는 [Dockerfile](../../Dockerfile), [Compose 설정](../../compose.yaml), [빌드 제외 규칙](../../.dockerignore)이 포함되어 있으며, 이미지는 Bun 1.4.3을 기반으로 FFmpeg를 내장합니다.

```sh
docker compose up -d --build
```

- `http://127.0.0.1:3000`에 접속합니다.
- 데이터는 이름이 지정된 볼륨 `toonflowData`(컨테이너 내 `/app/data/`에 마운트)에 저장됩니다. 컨테이너를 중지하거나 다시 만들어도 데이터는 유실되지 않습니다. `docker compose down -v`를 사용하지 마세요.
- 컨테이너 내 서비스는 `0.0.0.0`에서 수신하므로 포트 매핑이나 리버스 프록시로 접근 출처를 제어하세요.

자주 쓰는 명령:

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## 데이터와 프라이버시

- 앱은 익명 통계나 텔레메트리 데이터를 수집하거나 전송하지 않습니다.
- 프로젝트, 프롬프트, 대화, 생성 내용은 로컬 데이터 디렉터리에 저장됩니다.
- 모델 공급자를 설정한 뒤에만 해당 API로 요청을 보내며, 요청 내용은 그 공급자의 서비스 약관을 따릅니다.
- 자동 업데이트는 기본적으로 꺼져 있으며, 설정에서 자체 구축한 업데이트 소스를 구성할 수 있습니다.

## 오픈소스 라이선스

Carefree는 [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app)를 기반으로 이차 개발되었으며 [MIT 라이선스](../../LICENSE)를 따릅니다. 타사 의존성과 소재는 각자의 라이선스와 저작권 고지를 따릅니다.

## 감사의 글

오픈소스 기반을 제공한 Toonflow 프로젝트와 기여자, 그리고 ComfyUI, Bun, Vue, Electrobun 등 오픈소스 프로젝트에 감사드립니다.
