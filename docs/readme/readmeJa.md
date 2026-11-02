<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜AI ショートドラマ・コミックドラマ向け無限キャンバス

ショートドラマ、コミックドラマ、ショート動画のクリエイター向けローカル AI 制作ツール。無限キャンバス上で脚本を書き、絵コンテを分割し、キャラクターとシーンを管理し、画像と動画を生成できます。

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree は完全にローカルで動作する AI 制作ツールです。プロジェクト、素材、会話、生成結果はすべて自分のデバイスに保存され、利用データをどのサーバーにも送信しません。モデルサービスは自分で設定します。任意の OpenAI 互換 API、ローカルの ComfyUI、ローカルまたは自前の TTS サービスを利用できます。

## 機能

| 機能 | 説明 |
| --- | --- |
| 無限キャンバス | 脚本、絵コンテ、キャラクター、シーン、動画クリップを 1 枚のキャンバスで整理でき、グループ化と接続に対応します。 |
| テキスト制作 | 任意の OpenAI 互換テキスト API に接続し、テキストノードで脚本、人物設定、カメラ記述を書きます。 |
| 画像生成 | 自前の ComfyUI ワークフローでキャラクターの三面図、シーン、絵コンテ画像を生成します。 |
| 動画生成 | ComfyUI またはサードパーティのメディア API で動画カットを生成し、複数の参照素材と生成のキャンセルに対応します。 |
| 音声生成 | OpenAI 互換の `/audio/speech` API に接続します。TTS をローカルに導入すればオフラインで吹き替えできます。 |
| 素材管理 | 画像、動画、音声をまとめて素材ライブラリに保存し、プレビュー、整理、ダウンロードができます。 |
| ローカル優先 | デフォルトではローカルのみで待ち受け、必要に応じてデバイス連携を有効にすると LAN 内で共有できます。 |
| 多言語 | UI は 21 言語に対応しています。 |

利用できるモデル、解像度、再生時間、音声機能は、設定したプロバイダーとワークフローによって異なります。

### 典型的な制作フロー

1. **脚本と絵コンテ**：テキストノードでストーリー、人物設定、カメラ記述を整理し、言語モデルを使って繰り返し練ります。
2. **キャラクターとシーン**：参照画像を読み込むか、画像生成ノードでキャラクター、シーン、絵コンテ画像を作成します。
3. **動画カット**：テキストと画像の参照を接続し、動画モデルと生成モードを選んでカットごとに生成します。
4. **プレビューと書き出し**：キャンバス上で画像と動画クリップをプレビュー、整理し、素材をダウンロードしてポストプロダクションに進みます。

## クライアントのインストール

| システム | 説明 |
| --- | --- |
| Windows | インストーラーを実行すると、WebView2 が自動的に検出されてインストールされます。インストール後に起動してすぐ終了する場合は、[WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) を手動でインストールしてください。 |
| macOS（Apple Silicon） | Carefree を「アプリケーション」にドラッグしてから開きます。開発元を検証できない旨の警告が出た場合は、「システム設定 → プライバシーとセキュリティ」で開くことを許可してください。 |

依存プロトコルは `carefree://` で、クライアント内の再起動とディープリンク遷移に使われます。

## ソースからの実行

[Bun 1.4.3](https://bun.sh/docs/installation) が必要です。

```sh
git clone <リポジトリの URL> carefree
cd carefree
bun install --frozen-lockfile

# 開発モード：Web と Server を同時に起動
bun run dev
```

`http://127.0.0.1:3000` を開きます。初回起動時に組み込みノード、ツール、プラグインが初期化され、`myProject` 作業ディレクトリが作成されます。

### ビルド

```sh
# ノード、拡張、Web、Server をビルド
bun run build

# 単体の Server 成果物をビルド
bun run build:server

# デスクトップクライアントをビルド
bun run build:desktop
bun run package:desktop
```

Windows インストーラーはデフォルトでは署名されません。公開前に以下の環境変数を設定すると、`bun run build:desktop` / `bun run package:desktop` が `signtool` を使って 4 つのランチャー（`startupLauncher.exe`、`protocolLauncher.exe`、`saveFileDialog.exe`、`updateHelper.exe`）、インストーラーの補助プログラム（`checkWebView2.exe`、`checkRunning.exe`）、最終的な `Setup.exe` に署名し、署名を検証します：

| 変数 | 説明 |
| --- | --- |
| `CAREFREE_SIGN_PFX` | `.pfx` 証明書の絶対パス。未設定の場合は署名をスキップ |
| `CAREFREE_SIGN_PASSWORD` | 証明書のパスワード。証明書が暗号化されていない場合は空欄 |
| `CAREFREE_SIGN_TIMESTAMP_URL` | RFC3161 タイムスタンプサービス。既定値は `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | `signtool.exe` のパス。既定では Windows SDK から自動検索 |

Windows x64 環境と Windows SDK が必要です。アプリ本体は差分更新用の tar 内にあり、今回の署名対象には含まれません。署名が必要な場合は、先にアプリのファイルへ署名してから tar と更新マニフェストを再生成してください。

GitHub Actions ではリポジトリの Secrets で証明書を提供します。設定後は Windows ビルドが自動的に署名と検証を行います：

| Secret | 説明 |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | `.pfx` 証明書ファイルの Base64 テキスト。未設定の場合は CI が署名をスキップ |
| `CAREFREE_SIGN_PASSWORD` | PFX エクスポートのパスワード。暗号化されていない場合は空欄 |

証明書はビルド手順の間だけ一時的にディスクへ書き込まれ、ジョブ終了時に削除されます。タイムスタンプの URL は `CAREFREE_SIGN_TIMESTAMP_URL` 環境変数で上書きできます。

### サーバー

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- デフォルトでは `127.0.0.1:3000` で待ち受け、外部には公開しません。
- ポートは `TOONFLOW_SERVER_PORT` で変更できます。
- LAN からアクセスする必要がある場合は、`TOONFLOW_SERVER_HOST=0.0.0.0` を設定し、ファイアウォールで接続元を自分で制限してください。アプリ内で「デバイス連携」を有効にする方法がより推奨され、必要なときだけ独立したポートで待ち受けます。
- 設定、プラグイン、ワークスペースはデフォルトで `data/` に保存されます。リモートで使う場合は SSH トンネル経由でアクセスできます：

```sh
ssh -N -L 3000:127.0.0.1:3000 ユーザー名@サーバーアドレス
```

## モデルの設定

設定の「モデルサービス」を開きます：

- **テキストモデル**：OpenAI 互換のプロバイダーを追加し、API エンドポイント、API Key、モデル一覧を入力します。
- **画像 / 動画**：ComfyUI プロバイダーをインストールして設定し、ローカルの ComfyUI アドレスとワークフローを入力します。
- **音声**：ローカルの TTS プロバイダーをインストールします。既定のアドレスは `http://127.0.0.1:8880/v1` で、`/audio/speech` に対応する任意のサービスも指定できます。
- **カスタムプロバイダー**：設定で `.ts` のアダプターファイルを読み込み、任意のサードパーティ API を拡張できます。

API Key はローカルのデータディレクトリにのみ保存され、アップロードされることはありません。

## Docker

リポジトリには [Dockerfile](../../Dockerfile)、[Compose 設定](../../compose.yaml)、[ビルド除外ルール](../../.dockerignore) が含まれています。イメージは Bun 1.4.3 をベースに FFmpeg を同梱しています。

```sh
docker compose up -d --build
```

- `http://127.0.0.1:3000` にアクセスします。
- データは名前付きボリューム `toonflowData`（コンテナ内の `/app/data/` にマウント）に保存されます。コンテナを停止・再作成してもデータは失われません。`docker compose down -v` は使用しないでください。
- コンテナ内のサービスは `0.0.0.0` で待ち受けます。ポートマッピングやリバースプロキシで接続元を制御してください。

よく使うコマンド：

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## データとプライバシー

- アプリは匿名の統計やテレメトリを収集・送信しません。
- プロジェクト、プロンプト、会話、生成内容はローカルのデータディレクトリに保存されます。
- モデルのプロバイダーを設定した場合にのみ、対応する API へリクエストを送信します。リクエスト内容はそのプロバイダーの利用規約に従います。
- 自動更新はデフォルトで無効です。設定から自前の更新元を構成できます。

## オープンソースライセンス

Carefree は [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) をベースに二次開発され、[MIT ライセンス](../../LICENSE) に従います。サードパーティの依存関係と素材は、それぞれのライセンスと著作権表示に従います。

## 謝辞

オープンソースの基盤を提供してくださった Toonflow プロジェクトとそのコントリビューター、そして ComfyUI、Bun、Vue、Electrobun などのオープンソースプロジェクトに感謝します。
