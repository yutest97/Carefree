<div align="center">

<img src="../../packages/assets/logo.svg" alt="Carefree" width="120" height="120" />

# Carefree｜Canvas vô hạn cho phim ngắn và phim truyện tranh AI

Công cụ sáng tạo AI chạy cục bộ dành cho nhà sáng tạo phim ngắn, phim truyện tranh và video ngắn: viết kịch bản, chia phân cảnh, quản lý nhân vật và bối cảnh, tạo hình ảnh và video trên một canvas vô hạn.

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](../../LICENSE)
![Bun](https://img.shields.io/badge/Bun-1.4.3-14151A?style=flat-square&logo=bun&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white)
![Electrobun](https://img.shields.io/badge/Desktop-Electrobun-8257E5?style=flat-square)

</div>

[简体中文](../../README.md) · [繁體中文](./readmeZhTw.md) · [English](./readmeEn.md) · [日本語](./readmeJa.md) · [Русский](./readmeRu.md) · [Tiếng Việt](./readmeVi.md) · [ไทย](./readmeTh.md) · [한국어](./readmeKo.md) · [हिन्दी](./readmeHi.md) · [Bahasa Indonesia](./readmeId.md) · [Bahasa Melayu](./readmeMs.md) · [Filipino](./readmeFil.md) · [বাংলা](./readmeBn.md) · [اردو](./readmeUr.md) · [தமிழ்](./readmeTa.md) · [తెలుగు](./readmeTe.md) · [मराठी](./readmeMr.md) · [ਪੰਜਾਬੀ](./readmePa.md) · [العربية](./readmeAr.md) · [فارسی](./readmeFa.md) · [Türkçe](./readmeTr.md)

Carefree là công cụ sáng tạo AI chạy hoàn toàn cục bộ. Dự án, tư liệu, hội thoại và kết quả tạo đều được lưu trên thiết bị của bạn, không gửi dữ liệu sử dụng đến bất kỳ máy chủ nào. Dịch vụ mô hình do bạn tự cấu hình: mọi giao diện tương thích OpenAI, ComfyUI cục bộ, cùng dịch vụ TTS cục bộ hoặc tự dựng.

## Tính năng

| Tính năng | Mô tả |
| --- | --- |
| Canvas vô hạn | Tổ chức kịch bản, phân cảnh, nhân vật, bối cảnh và đoạn video trên cùng một canvas, hỗ trợ nhóm và liên kết. |
| Sáng tác văn bản | Kết nối mọi giao diện văn bản tương thích OpenAI, viết kịch bản, thiết lập nhân vật và mô tả cảnh quay trong nút văn bản. |
| Tạo hình ảnh | Tạo ba hình chiếu nhân vật, bối cảnh và ảnh phân cảnh bằng quy trình ComfyUI tự dựng. |
| Tạo video | Tạo cảnh quay video qua ComfyUI hoặc giao diện truyền thông bên thứ ba, hỗ trợ nhiều tư liệu tham chiếu và hủy tạo. |
| Tạo giọng nói | Kết nối giao diện `/audio/speech` tương thích OpenAI; triển khai TTS cục bộ là có thể lồng tiếng ngoại tuyến. |
| Quản lý tư liệu | Hình ảnh, video, âm thanh được đưa vào thư viện tư liệu để xem trước, sắp xếp và tải xuống. |
| Ưu tiên cục bộ | Mặc định chỉ lắng nghe trên máy, bật kết nối thiết bị khi cần để chia sẻ trong mạng LAN. |
| Đa ngôn ngữ | Giao diện hỗ trợ 21 ngôn ngữ. |

Các mô hình, độ phân giải, thời lượng và khả năng âm thanh cụ thể phụ thuộc vào nhà cung cấp và quy trình bạn cấu hình.

### Quy trình sáng tạo điển hình

1. **Kịch bản và phân cảnh**:Dùng nút văn bản để sắp xếp câu chuyện, thiết lập nhân vật và mô tả cảnh quay, lặp lại với sự hỗ trợ của mô hình ngôn ngữ.
2. **Nhân vật và bối cảnh**:Nhập ảnh tham chiếu, hoặc tạo nhân vật, bối cảnh và ảnh phân cảnh bằng nút tạo hình ảnh.
3. **Cảnh quay video**:Kết nối tham chiếu văn bản và hình ảnh, chọn mô hình video và chế độ tạo, rồi tạo từng cảnh quay.
4. **Xem trước và xuất**:Xem trước, sắp xếp hình ảnh và đoạn video trên canvas, tải tư liệu về để tiếp tục hậu kỳ.

## Cài đặt ứng dụng khách

| Hệ thống | Mô tả |
| --- | --- |
| Windows | Chạy gói cài đặt, trình cài sẽ tự động phát hiện và cài WebView2. Nếu sau khi cài đặt mở lên bị thoát ngay, hãy cài thủ công [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/). |
| macOS (Apple Silicon) | Kéo Carefree vào "Ứng dụng" rồi mở trực tiếp. Nếu hiện thông báo không xác minh được nhà phát triển, hãy cho phép mở trong "Cài đặt hệ thống → Quyền riêng tư và bảo mật". |

Giao thức phụ thuộc là `carefree://`, dùng để khởi động lại và mở liên kết sâu trong ứng dụng khách.

## Chạy từ mã nguồn

Cần [Bun 1.4.3](https://bun.sh/docs/installation).

```sh
git clone <địa chỉ kho lưu trữ của bạn> carefree
cd carefree
bun install --frozen-lockfile

# Chế độ phát triển: khởi động đồng thời Web và Server
bun run dev
```

Mở `http://127.0.0.1:3000`. Lần khởi động đầu tiên sẽ khởi tạo các nút, công cụ và plugin tích hợp, đồng thời tạo thư mục làm việc `myProject`.

### Xây dựng

```sh
# Xây dựng nút, tiện ích mở rộng, Web và Server
bun run build

# Xây dựng sản phẩm Server độc lập
bun run build:server

# Xây dựng ứng dụng khách máy tính
bun run build:desktop
bun run package:desktop
```

Gói cài đặt Windows mặc định không được ký. Sau khi đặt các biến môi trường dưới đây trước khi phát hành, `bun run build:desktop` / `bun run package:desktop` sẽ tự động dùng `signtool` để ký và xác minh chữ ký cho bốn trình khởi chạy (`startupLauncher.exe`, `protocolLauncher.exe`, `saveFileDialog.exe`, `updateHelper.exe`), chương trình phụ trợ của trình cài đặt (`checkWebView2.exe`, `checkRunning.exe`) và `Setup.exe` cuối cùng:

| Biến | Mô tả |
| --- | --- |
| `CAREFREE_SIGN_PFX` | Đường dẫn tuyệt đối của chứng chỉ `.pfx`; bỏ qua ký nếu chưa đặt |
| `CAREFREE_SIGN_PASSWORD` | Mật khẩu chứng chỉ, để trống nếu chứng chỉ không được mã hóa |
| `CAREFREE_SIGN_TIMESTAMP_URL` | Dịch vụ nhãn thời gian RFC3161, mặc định là `http://timestamp.digicert.com` |
| `SIGNTOOL_PATH` | Đường dẫn `signtool.exe`, mặc định tự tìm từ Windows SDK |

Cần môi trường Windows x64 và Windows SDK. Chương trình chính của ứng dụng nằm trong tar cập nhật tăng dần, không thuộc phạm vi ký lần này; nếu cần ký, hãy ký tệp ứng dụng trước rồi tạo lại tar và danh sách cập nhật.

Trong GitHub Actions, chứng chỉ được cung cấp qua Secrets của kho lưu trữ; sau khi cấu hình, bản dựng Windows sẽ tự động ký và xác minh chữ ký:

| Secret | Mô tả |
| --- | --- |
| `CAREFREE_SIGN_PFX_BASE64` | Văn bản Base64 của tệp chứng chỉ `.pfx`; CI bỏ qua ký nếu chưa cấu hình |
| `CAREFREE_SIGN_PASSWORD` | Mật khẩu xuất PFX, để trống nếu không được mã hóa |

Chứng chỉ chỉ được ghi tạm ra đĩa trong bước xây dựng và được dọn dẹp khi tác vụ kết thúc. Địa chỉ nhãn thời gian có thể ghi đè bằng biến môi trường `CAREFREE_SIGN_TIMESTAMP_URL`.

### Máy chủ

```sh
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```

- Mặc định lắng nghe trên `127.0.0.1:3000`, không mở ra mạng ngoài.
- Có thể đổi cổng qua `TOONFLOW_SERVER_PORT`.
- Khi thật sự cần truy cập từ LAN, hãy đặt `TOONFLOW_SERVER_HOST=0.0.0.0` và tự giới hạn nguồn bằng tường lửa; nên bật "Kết nối thiết bị" trong ứng dụng, tính năng này chỉ lắng nghe cổng riêng khi cần.
- Cấu hình, plugin và không gian làm việc mặc định được lưu trong `data/`. Khi dùng từ xa, có thể truy cập qua đường hầm SSH:

```sh
ssh -N -L 3000:127.0.0.1:3000 tênngười_dùng@địachỉmáy_chủ
```

## Cấu hình mô hình

Mở "Dịch vụ mô hình" trong phần cài đặt:

- **Mô hình văn bản**: Thêm nhà cung cấp tương thích OpenAI, điền địa chỉ giao diện, API Key và danh sách mô hình.
- **Hình ảnh / Video**: Cài đặt và cấu hình nhà cung cấp ComfyUI, điền địa chỉ ComfyUI cục bộ và quy trình.
- **Giọng nói**: Cài đặt nhà cung cấp TTS cục bộ, địa chỉ mặc định là `http://127.0.0.1:8880/v1`, cũng có thể trỏ đến dịch vụ tương thích `/audio/speech` bất kỳ.
- **Nhà cung cấp tùy chỉnh**: Có thể nhập tệp thích ứng `.ts` trong cài đặt để mở rộng mọi giao diện bên thứ ba.

API Key chỉ được lưu trong thư mục dữ liệu cục bộ, không được tải lên.

## Docker

Kho lưu trữ cung cấp [Dockerfile](../../Dockerfile), [Cấu hình Compose](../../compose.yaml) và [Quy tắc loại trừ khi xây dựng](../../.dockerignore); image dựa trên Bun 1.4.3 và tích hợp sẵn FFmpeg.

```sh
docker compose up -d --build
```

- Truy cập `http://127.0.0.1:3000`.
- Dữ liệu được lưu trong volume có tên `toonflowData` (gắn vào `/app/data/` trong container); dừng hoặc tạo lại container sẽ không mất dữ liệu, đừng dùng `docker compose down -v`.
- Dịch vụ trong container lắng nghe trên `0.0.0.0`, hãy kiểm soát nguồn truy cập qua ánh xạ cổng hoặc proxy ngược.

Các lệnh thường dùng:

```sh
docker compose logs -f toonflow
docker compose stop
docker compose start
docker compose down
```

## Dữ liệu và quyền riêng tư

- Ứng dụng không thu thập, không gửi thống kê ẩn danh hay dữ liệu telemetry.
- Dự án, lời nhắc, hội thoại và nội dung tạo được lưu trong thư mục dữ liệu cục bộ.
- Chỉ sau khi bạn cấu hình nhà cung cấp mô hình mới gửi yêu cầu đến giao diện tương ứng; nội dung yêu cầu chịu ràng buộc điều khoản dịch vụ của nhà cung cấp đó.
- Cập nhật tự động mặc định tắt, có thể cấu hình nguồn cập nhật tự dựng trong cài đặt.

## Giấy phép nguồn mở

Carefree được phát triển dựa trên [Toonflow](https://github.com/HBAI-Ltd/Toonflow-app), tuân theo [Giấy phép MIT](../../LICENSE). Các phụ thuộc và tư liệu bên thứ ba tuân theo giấy phép và tuyên bố bản quyền riêng của chúng.

## Lời cảm ơn

Cảm ơn dự án Toonflow và những người đóng góp đã mang đến nền tảng nguồn mở, cùng các dự án nguồn mở như ComfyUI, Bun, Vue, Electrobun.
