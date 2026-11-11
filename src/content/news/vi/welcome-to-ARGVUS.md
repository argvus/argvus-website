---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Chào mừng đến với ARGVUS
description: Khám phá ARGVUS, môi trường desktop mô-đun dành cho Arch Linux, xây dựng trên Wayland và Hyprland, tích hợp cài đặt, giao diện, công cụ phiên làm việc và ứng dụng.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---

# Chào mừng đến với ARGVUS

Hôm nay, chúng tôi giới thiệu **ARGVUS**: một môi trường desktop mô-đun dành cho **Arch Linux**, được xây dựng cho **Wayland** và vận hành bằng **Hyprland**.

ARGVUS kết hợp các phần của một desktop Linux: đăng nhập và khởi chạy phiên làm việc, cửa sổ và không gian làm việc, thanh tác vụ và bảng điều khiển nhanh, cài đặt, chủ đề, thông báo, màn hình, nguồn điện, mạng và các ứng dụng thường dùng. Những phần này được tổ chức thành các gói chuyên biệt cùng chia sẻ một mô hình cấu hình, để desktop hoạt động như một hệ thống thống nhất mà không trở thành một chương trình nguyên khối.

> **Tóm lại:** Arch Linux là hệ điều hành, Hyprland là trình tổng hợp Wayland, còn ARGVUS điều phối phiên làm việc và trải nghiệm desktop xoay quanh chúng.

## Desktop gồm các thành phần phối hợp với nhau

Phiên ARGVUS có lộ trình rõ ràng từ lúc đăng nhập đến desktop:

```text
Đăng nhập hoặc TTY
    ↓
Phiên ARGVUS → Hyprland
    ↓
Thanh tác vụ · Bảng điều khiển · Thông báo · Hình nền · Dịch vụ nhàn rỗi
```

Trình quản lý phiên khởi chạy và giám sát các dịch vụ desktop. Hyprland quản lý cửa sổ, không gian làm việc và màn hình. Thanh tác vụ, Bảng điều khiển, ứng dụng cài đặt và các gói dịch vụ chuyên biệt cung cấp những giao diện bạn sử dụng hằng ngày.

| Khu vực | Những gì mang lại cho desktop |
| --- | --- |
| **Đăng nhập và phiên làm việc** | Màn hình chào ARGVUS, đăng nhập đồ họa, khởi chạy từ TTY và các dịch vụ người dùng được quản lý. |
| **Cửa sổ và không gian làm việc** | Cấu hình Hyprland với phím tắt, bố cục, quản lý màn hình và thiết lập giao diện dùng chung. |
| **Thanh tác vụ** | Thanh dựa trên Waybar cho không gian làm việc, cửa sổ và trạng thái hệ thống, kèm các tiện ích tùy chọn. |
| **Bảng điều khiển** | Giao diện Quickshell cho thao tác nhanh, điều khiển phiên và nguồn điện, cùng tiện ích desktop. |
| **Trung tâm điều khiển** | Ứng dụng cài đặt ưu tiên thao tác bàn phím để cấu hình và quản trị desktop. |
| **Dịch vụ desktop** | Tích hợp chuyên biệt cho màn hình, mạng, Bluetooth, nguồn điện, thông báo, tường lửa và bộ nhớ tháo rời. |

Mỗi thành phần tự quản lý lệnh và cách hoạt động của dịch vụ. Thiết kế mô-đun này giúp bảo trì hoặc cải tiến từng phần mà không biến toàn bộ desktop thành một ứng dụng gắn kết chặt chẽ.

## Các cài đặt phối hợp với nhau

Thay đổi một cài đặt nên tạo ra ảnh hưởng có thể dự đoán trên toàn desktop. ARGVUS lưu tập trung trạng thái giao diện và tùy chọn, sau đó áp dụng chúng cho những thành phần liên quan. Trung tâm điều khiển cung cấp giao diện có hướng dẫn để chỉnh cài đặt; nếu thích dùng terminal, bạn cũng có thể sử dụng các công cụ dòng lệnh.

Ví dụ, đổi chủ đề có thể cập nhật đồng thời trình tổng hợp, ứng dụng GTK và Qt, thanh tác vụ, Bảng điều khiển, trình khởi chạy, thông báo và màn hình khóa. Bạn cũng có thể chọn màu nhấn và kiểu bố cục:

| Kiểu | Cảm giác |
| --- | --- |
| **Sticky** | Khoảng cách gọn và cửa sổ gần các bề mặt desktop hơn. |
| **Spaced** | Khoảng cách rộng hơn, góc bo tròn, bóng đổ và nhiều khoảng thoáng quanh giao diện. |

Hệ thống hình ảnh có **23 nhóm chủ đề**, mỗi nhóm dùng được với cả hai kiểu, cùng hình nền, phông chữ, chủ đề biểu tượng và hiệu ứng có thể cấu hình. Chọn giao diện có sẵn hoặc điều chỉnh màu nhấn theo ý mình.

> **Một điểm cần phân biệt:** tùy chọn bạn chọn là nguồn dữ liệu chuẩn. Các tệp được tạo cho từng thành phần desktop là bản thể hiện của trạng thái dùng chung đó. Vì vậy, hãy thay đổi qua cài đặt ARGVUS hoặc các lệnh được hỗ trợ thay vì sửa trực tiếp tệp được tạo.

## Công cụ hữu ích đã được kết nối

ARGVUS tích hợp nhiều tiện ích nhỏ để các tác vụ thường ngày luôn trong tầm tay:

- **Trình khởi chạy ứng dụng:** nhấn `SUPER + D` để tìm ứng dụng đồ họa đã cài. Các menu bàn phím khác có thể mở dự án, máy chủ SSH, đoạn mã, emoji, máy tính và bảng tra cứu nhanh.
- **Điều khiển màn hình:** xem các màn hình và điều chỉnh độ phân giải, tần số quét, tỷ lệ, vị trí, hướng nếu trình tổng hợp đang chạy và phần cứng hỗ trợ.
- **Thao tác nguồn điện và phiên:** dùng Bảng điều khiển để khóa, tạm ngưng, đăng xuất hoặc tắt máy ngay. Cấu hình hành vi nhàn rỗi và màn hình lâu dài trong Trung tâm điều khiển.
- **Không làm phiền:** điều khiển việc gửi thông báo từ Bảng điều khiển; thông báo nhận được khi tính năng này đang bật sẽ được giữ lại để xem sau.
- **Thiết bị tháo rời:** truy cập thao tác lưu trữ từ menu tích hợp và giao diện thanh tác vụ.
- **ARGVUS Focus:** chạy các phiên tập trung theo kiểu Pomodoro, giờ nghỉ và thông báo, kèm lịch sử lưu cục bộ.
- **ARGVUS Clock:** dùng đồng hồ thế giới, đồng hồ bấm giờ, bộ hẹn giờ và báo thức, bao gồm báo lại và báo cáo về báo thức bị lỡ.
- **Công cụ terminal:** mở cấu hình terminal, trình theo dõi hệ thống và các ứng dụng TUI tích hợp khác.

Một số tính năng là gói tùy chọn. Chẳng hạn, có thể thêm tích hợp tác nhân lập trình và trò chơi mà không bắt buộc chúng trở thành một phần của phiên cơ bản. Tích hợp AI khởi chạy tác nhân đã chọn trong terminal; ARGVUS không tạo tài khoản hoặc thiết lập khóa API hay gói đăng ký thay bạn.

## Bắt đầu trên Arch Linux

Với bản cài Arch Linux mới, cách bắt đầu nhanh được tài liệu hướng dẫn là:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

Trình cài đặt cấu hình kho gói ARGVUS và cài gói `argvus` cùng các phần phụ thuộc. Sau đó đăng xuất và chọn **ARGVUS** trong trình quản lý hiển thị, hoặc khởi chạy phiên ARGVUS từ TTY.

```sh
# Mở Trung tâm điều khiển
argvus --control-center

# Mở lại hướng dẫn thiết lập lần đầu bất cứ lúc nào
argvus welcome
```

ARGVUS được xây dựng cho **Arch Linux**, **Wayland** và **Hyprland**; đây không phải một bản phân phối Linux độc lập. Trước khi cài đặt, hãy xem [hướng dẫn cài đặt](https://argvus.github.io/docs/getting-started/installation/) để biết yêu cầu, cách thiết lập thủ công và chi tiết gói hiện tại.

## Khám phá ARGVUS

Bắt đầu với [tài liệu người dùng](https://argvus.github.io/docs/intro/) để tìm hiểu cách thiết lập và sử dụng hằng ngày, hoặc khám phá [kho mã nguồn ARGVUS](https://github.com/argvus/argvus) và [tổ chức ARGVUS trên GitHub](https://github.com/argvus/) để tìm hiểu các thành phần riêng lẻ.

Chào mừng đến với desktop mô-đun bên trong và phối hợp ở những nơi cần thiết. **Chào mừng đến với ARGVUS.**
