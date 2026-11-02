<div align="center">

<img src="./packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜AI 短剧与漫剧无限画布

面向短剧、漫剧和短视频创作者的本地 AI 创作工具：在无限画布上写剧本、拆分镜、管理角色与场景、生成图片与视频。

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

Carefree 是一个完全本地运行的 AI 创作工具。项目、素材、对话与生成结果都保存在自己的设备上，不向任何服务器上报使用数据。模型服务由你自己配置：任意 OpenAI 兼容接口、本地 ComfyUI，以及本地或自建的 TTS 服务。

## 功能

| 能力 | 说明 |
| --- | --- |
| 无限画布 | 在同一张画布中组织剧本、分镜、角色、场景与视频片段，支持分组与连线。 |
| 文本创作 | 接入任意 OpenAI 兼容文本接口，在文本节点中写剧本、人物设定和镜头描述。 |
| 图片生成 | 通过自建 ComfyUI 工作流生成角色三视图、场景与分镜图。 |
| 视频生成 | 通过 ComfyUI 或第三方媒体接口生成视频镜头，支持多参考素材与取消生成。 |
| 语音生成 | 接入 OpenAI 兼容的 `/audio/speech` 接口，本地部署 TTS 即可离线配音。 |
| 素材管理 | 图片、视频、音频统一进入素材库，可预览、整理与下载。 |
| 本地优先 | 默认只在本机监听服务，按需开启设备互联后可在局域网内共享。 |
| 多语言 | 界面支持 21 种语言。 |

具体可用的模型、分辨率、时长与音频能力取决于你配置的供应商和工作流。

### 典型创作流程

1. **剧本与分镜**：用文本节点整理故事、人物设定与镜头描述，借助语言模型迭代。
2. **角色与场景**：导入参考图，或通过图片生成节点制作角色、场景和分镜图。
3. **视频镜头**：连接文本与图片参考，选择视频模型和生成模式，逐镜头生成。
4. **预览与导出**：在画布中预览、整理图片与视频片段，下载素材继续后期。

## 安装客户端

| 系统 | 说明 |
| --- | --- |
| Windows | 运行安装包，安装器会自动检测并安装 WebView2。若安装后打开闪退，请手动安装 [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)。 |
| macOS（Apple Silicon） | 将 Carefree 拖入“应用程序”后直接打开。若提示无法验证开发者，请在“系统设置 → 隐私与安全性”中允许打开。 |

依赖协议为 `carefree://`，用于客户端内的重启与深链接跳转。

## 从源码运行

需要 [Bun 1.4.3](https://bun.sh/docs/installation)。

```sh
git clone <你的仓库地址> carefree
cd carefree
bun install --frozen-lockfile

# 开发模式：同时启动 Web 与 Server
bun run dev
```

打开 `http://127.0.0.1:3000`。首次启动会初始化内置节点、工具与插件，并创建 `myProject` 工作目录。

### 构建

```sh
# 构建节点、扩展、Web 与 Server
bun run build

# 构建独立的 Server 产物
bun run build:server

# 构建桌面客户端
bun run build:desktop
bun run package:desktop
```

Windows 安装包默认不签名。发布前设置以下环境变量后，`bun run build:desktop` / `bun run package:desktop` 会自动用 `signtool` 为四个启动器（`startupLauncher.exe`、`protocolLauncher.exe`、`saveFileDialog.exe`、`updateHelper.exe`）、安装器辅助程序（`checkWebView2.exe`、`checkRunning.exe`）和最终 `Setup.exe` 签名并验签：

| 变量 | 说明 |
| --- | --- |
| `CAREFREE_SIGN_PFX` | `.pfx` 证书绝对路径；未设置时跳过签名 |
| `CAREFREE_SIGN_PASSWORD` | 证书密码，证书未加密时留空 |
| `CAREFREE_SIGN_TIMESTAMP_URL` | RFC3161 时间戳服务，默认 `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | `signtool.exe` 路径，默认从 Windows SDK 自动查找 |

需要 Windows x64 环境与 Windows SDK。应用主程序位于增量更新 tar 内，不在本次签名范围；若需签名，应先签名应用文件再重新生成 tar 与更新清单。

GitHub Actions 中改用仓库 Secrets 提供证书，配置后 Windows 构建会自动签名并验签：

| Secret | 说明 |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | `.pfx` 证书文件的 Base64 文本；未配置时 CI 跳过签名 |
| `CAREFREE_SIGN_PASSWORD` | PFX 导出密码，未加密时留空 |

证书只在构建步骤临时落盘，任务结束即清理。时间戳地址可通过 `CAREFREE_SIGN_TIMESTAMP_URL` 环境变量覆盖。

### 服务端

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- 默认监听 `127.0.0.1:3000`，不对外网开放。
- 端口可通过 `TOONFLOW_SERVER_PORT` 修改。
- 确需局域网访问时，设置 `TOONFLOW_SERVER_HOST=0.0.0.0`，并自行用防火墙限制来源；更推荐在应用内开启“设备互联”，它只在需要时监听独立端口。
- 配置、插件与工作区默认保存在 `data/`。远程使用时可通过 SSH 隧道访问：

```sh
ssh -N -L 3000:127.0.0.1:3000 用户名@服务器地址
```

## 配置模型

打开设置中的“模型服务”：

- **文本模型**：新增 OpenAI 兼容供应商，填写接口地址、API Key 与模型列表。
- **图片 / 视频**：安装并配置 ComfyUI 供应商，填写本地 ComfyUI 地址与工作流。
- **语音**：安装本地 TTS 供应商，默认地址为 `http://127.0.0.1:8880/v1`，也可指向任意兼容 `/audio/speech` 的服务。
- **自定义供应商**：可在设置中导入 `.ts` 适配文件，扩展任意第三方接口。

API Key 仅保存在本机数据目录中，不会上传。

## Docker

仓库提供 [Dockerfile](./Dockerfile)、[Compose 配置](./compose.yaml) 与 [构建排除规则](./.dockerignore)，镜像基于 Bun 1.4.3 并内置 FFmpeg。

```sh
docker compose up -d --build
```

- 访问 `http://127.0.0.1:3000`。
- 数据保存在命名卷 `toonflowData`（挂载到容器内 `/app/data/`）；停止或重建容器不会丢失数据，请勿使用 `docker compose down -v`。
- 容器内服务监听 `0.0.0.0`，请通过端口映射或反向代理控制访问来源。

常用命令：

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## 数据与隐私

- 应用不收集、不上报匿名统计或遥测数据。
- 项目、提示词、对话与生成内容保存在本机数据目录。
- 只有在你配置模型供应商后，才会向对应接口发送请求；请求内容受该供应商服务条款约束。
- 自动更新默认关闭，可在设置中配置自建更新源。

## 开源许可

Carefree 基于 [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) 二次开发，遵循 [MIT 许可证](./LICENSE)。第三方依赖与素材遵循各自的许可与版权声明。

## 致谢

感谢 Toonflow 项目及其贡献者提供的开源基础，以及 ComfyUI、Bun、Vue、Electrobun 等开源项目。
