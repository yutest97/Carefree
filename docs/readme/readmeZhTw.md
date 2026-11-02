<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜AI 短劇與漫劇無限畫布

為短劇、漫劇與短影音創作者打造的本地 AI 創作工具：在無限畫布上撰寫劇本、拆分鏡、管理角色與場景、生成圖片與影片。

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree 是一套完全在地端執行的 AI 創作工具。專案、素材、對話與生成結果都保存在自己的裝置上，不會將使用資料上報到任何伺服器。模型服務由你自己設定：任何 OpenAI 相容介面、本機 ComfyUI，以及本機或自建的 TTS 服務。

## 功能

| 能力 | 說明 |
| --- | --- |
| 無限畫布 | 在同一張畫布中組織劇本、分鏡、角色、場景與影片片段，支援群組與連線。 |
| 文字創作 | 接入任意 OpenAI 相容文字介面，在文字節點中撰寫劇本、人物設定與鏡頭描述。 |
| 圖片生成 | 透過自建 ComfyUI 工作流程生成角色三視圖、場景與分鏡圖。 |
| 影片生成 | 透過 ComfyUI 或第三方媒體介面生成影片鏡頭，支援多參考素材與取消生成。 |
| 語音生成 | 接入 OpenAI 相容的 `/audio/speech` 介面，在本機部署 TTS 即可離線配音。 |
| 素材管理 | 圖片、影片、音訊統一進入素材庫，可預覽、整理與下載。 |
| 本地優先 | 預設只在本機監聽服務，視需要開啟裝置互聯後可在區域網路內共享。 |
| 多語言 | 介面支援 21 種語言。 |

具體可用的模型、解析度、時長與音訊能力，取決於你設定的供應商與工作流程。

### 典型創作流程

1. **劇本與分鏡**：用文字節點整理故事、人物設定與鏡頭描述，並借助語言模型反覆調整。
2. **角色與場景**：匯入參考圖，或透過圖片生成節點製作角色、場景與分鏡圖。
3. **影片鏡頭**：連接文字與圖片參考，選擇影片模型與生成模式，逐鏡頭生成。
4. **預覽與匯出**：在畫布中預覽、整理圖片與影片片段，下載素材繼續後製。

## 安裝用戶端

| 系統 | 說明 |
| --- | --- |
| Windows | 執行安裝包，安裝程式會自動偵測並安裝 WebView2。若安裝後開啟即閃退，請手動安裝 [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)。 |
| macOS（Apple Silicon） | 將 Carefree 拖入「應用程式」後直接開啟。若提示無法驗證開發者，請在「系統設定 → 隱私權與安全性」中允許開啟。 |

相依協定為 `carefree://`，用於用戶端內的重啟與深層連結跳轉。

## 從原始碼執行

需要 [Bun 1.4.3](https://bun.sh/docs/installation)。

```sh
git clone <你的儲存庫位址> carefree
cd carefree
bun install --frozen-lockfile

# 開發模式：同時啟動 Web 與 Server
bun run dev
```

開啟 `http://127.0.0.1:3000`。首次啟動會初始化內建節點、工具與外掛，並建立 `myProject` 工作目錄。

### 建置

```sh
# 建置節點、擴充、Web 與 Server
bun run build

# 建置獨立的 Server 產物
bun run build:server

# 建置桌面用戶端
bun run build:desktop
bun run package:desktop
```

Windows 安裝包預設不簽署。發布前設定以下環境變數後，`bun run build:desktop` / `bun run package:desktop` 會自動以 `signtool` 為四個啟動器（`startupLauncher.exe`、`protocolLauncher.exe`、`saveFileDialog.exe`、`updateHelper.exe`）、安裝程式的輔助程式（`checkWebView2.exe`、`checkRunning.exe`）與最終的 `Setup.exe` 簽署並驗證簽章：

| 變數 | 說明 |
| --- | --- |
| `CAREFREE_SIGN_PFX` | `.pfx` 憑證的絕對路徑；未設定時略過簽署 |
| `CAREFREE_SIGN_PASSWORD` | 憑證密碼，憑證未加密時留空 |
| `CAREFREE_SIGN_TIMESTAMP_URL` | RFC3161 時間戳服務，預設為 `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | `signtool.exe` 路徑，預設從 Windows SDK 自動尋找 |

需要 Windows x64 環境與 Windows SDK。應用程式主程式位於增量更新的 tar 內，不在本次簽署範圍；若需簽署，應先為應用程式檔案簽署，再重新產生 tar 與更新清單。

在 GitHub Actions 中改用儲存庫 Secrets 提供憑證，設定後 Windows 建置會自動簽署並驗證簽章：

| Secret | 說明 |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | `.pfx` 憑證檔案的 Base64 文字；未設定時 CI 略過簽署 |
| `CAREFREE_SIGN_PASSWORD` | PFX 匯出密碼，未加密時留空 |

憑證只在建置步驟中暫時寫入磁碟，工作結束後即清除。時間戳位址可透過 `CAREFREE_SIGN_TIMESTAMP_URL` 環境變數覆寫。

### 伺服器

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- 預設監聽 `127.0.0.1:3000`，不對外網開放。
- 連接埠可透過 `TOONFLOW_SERVER_PORT` 修改。
- 確有區域網路存取需求時，設定 `TOONFLOW_SERVER_HOST=0.0.0.0`，並自行以防火牆限制來源；更建議在應用程式內開啟「裝置互聯」，它只在需要時監聽獨立連接埠。
- 設定、外掛與工作區預設保存在 `data/`。遠端使用時可透過 SSH 通道存取：

```sh
ssh -N -L 3000:127.0.0.1:3000 使用者名稱@伺服器位址
```

## 設定模型

開啟設定中的「模型服務」：

- **文字模型**：新增 OpenAI 相容供應商，填寫介面位址、API Key 與模型清單。
- **圖片 / 影片**：安裝並設定 ComfyUI 供應商，填寫本機 ComfyUI 位址與工作流程。
- **語音**：安裝本機 TTS 供應商，預設位址為 `http://127.0.0.1:8880/v1`，也可指向任何相容 `/audio/speech` 的服務。
- **自訂供應商**：可在設定中匯入 `.ts` 適配檔案，擴充任意第三方介面。

API Key 僅保存在本機資料目錄中，不會上傳。

## Docker

儲存庫提供 [Dockerfile](../../Dockerfile)、[Compose 設定](../../compose.yaml) 與 [建置排除規則](../../.dockerignore)，映像基於 Bun 1.4.3 並內建 FFmpeg。

```sh
docker compose up -d --build
```

- 存取 `http://127.0.0.1:3000`。
- 資料保存在具名磁碟區 `toonflowData`（掛載到容器內 `/app/data/`）；停止或重建容器不會遺失資料，請勿使用 `docker compose down -v`。
- 容器內服務監聽 `0.0.0.0`，請透過連接埠對應或反向代理控制存取來源。

常用指令：

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## 資料與隱私

- 應用程式不收集、不上報匿名統計或遙測資料。
- 專案、提示詞、對話與生成內容保存在本機資料目錄。
- 只有在你設定模型供應商後，才會向對應介面發送請求；請求內容受該供應商服務條款約束。
- 自動更新預設關閉，可在設定中設定自建更新來源。

## 開源授權

Carefree 基於 [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) 二次開發，遵循 [MIT 授權條款](../../LICENSE)。第三方相依套件與素材遵循各自的授權與著作權聲明。

## 致謝

感謝 Toonflow 專案及其貢獻者提供的開源基礎，以及 ComfyUI、Bun、Vue、Electrobun 等開源專案。
