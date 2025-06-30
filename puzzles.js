const gamePuzzles = [
    {
        text: "Trong mật mã học, 'AES' là viết tắt của gì?",
        options: ["Advanced Encryption Standard", "Asymmetric Encryption System", "American Encoding Service", "Automated Encryption Solution"],
        answer: "Advanced Encryption Standard",
        hint: "Đây là một tiêu chuẩn mã hóa đối xứng rất phổ biến."
    },
    {
        text: "Thuật toán nào thường được dùng để tạo 'chữ ký số' (Digital Signature)?",
        options: ["AES", "SHA-256", "RSA", "MD5"],
        answer: "RSA",
        hint: "Nó là một thuật toán mã hóa bất đối xứng."
    },
    {
        text: "SHA-256 được sử dụng chính để làm gì?",
        options: ["Mã hóa dữ liệu", "Giải mã dữ liệu", "Tạo hàm băm (Hash)", "Ký dữ liệu"],
        answer: "Tạo hàm băm (Hash)",
        hint: "Nó giúp kiểm tra tính toàn vẹn của dữ liệu."
    },
    {
        text: "Nếu một giao dịch bị 'SQL Injection', điều gì có thể xảy ra?",
        options: ["Dữ liệu bị mã hóa kép", "Kẻ tấn công có thể truy cập hoặc thay đổi cơ sở dữ liệu", "Chữ ký số bị làm giả", "Khóa mã hóa bị sai"],
        answer: "Kẻ tấn công có thể truy cập hoặc thay đổi cơ sở dữ liệu",
        hint: "Đây là một lỗ hổng liên quan đến việc nhập liệu không an toàn vào cơ sở dữ liệu."
    },
    {
        text: "Mã hóa đối xứng nghĩa là gì?",
        options: ["Dùng hai khóa khác nhau để mã hóa và giải mã", "Dùng cùng một khóa để mã hóa và giải mã", "Chỉ dùng một khóa để mã hóa", "Không cần khóa để giải mã"],
        answer: "Dùng cùng một khóa để mã hóa và giải mã",
        hint: "AES là một ví dụ điển hình."
    },
    {
        text: "Mục đích của việc kiểm tra tính toàn vẹn dữ liệu là gì?",
        options: ["Để làm cho dữ liệu bí mật", "Để đảm bảo dữ liệu không bị thay đổi", "Để nén dữ liệu", "Để tăng tốc độ truyền dữ liệu"],
        answer: "Để đảm bảo dữ liệu không bị thay đổi",
        hint: "Hash là công cụ chính cho việc này."
    },
    {
        text: "Trong một cuộc tấn công 'man-in-the-middle', kẻ tấn công làm gì?",
        options: ["Tấn công trực tiếp vào máy chủ", "Chặn đứng và có thể thay đổi liên lạc giữa hai bên", "Gửi email lừa đảo", "Tạo ra virus máy tính"],
        answer: "Chặn đứng và có thể thay đổi liên lạc giữa hai bên",
        hint: "Kẻ tấn công đứng giữa người gửi và người nhận."
    },
    {
        text: "Đâu là một ví dụ về 'Tấn công từ chối dịch vụ (DoS)'?",
        options: ["Đánh cắp mật khẩu", "Mã hóa tệp tin và yêu cầu tiền chuộc", "Gửi một lượng lớn yêu cầu làm quá tải máy chủ", "Sửa đổi dữ liệu giao dịch"],
        answer: "Gửi một lượng lớn yêu cầu làm quá tải máy chủ",
        hint: "Mục tiêu là làm cho dịch vụ không thể truy cập được."
    },
    {
        text: "Khái niệm 'Confidentiality' (Bảo mật/Bí mật) trong an toàn thông tin có nghĩa là gì?",
        options: ["Dữ liệu luôn có sẵn", "Chỉ những người được ủy quyền mới có quyền truy cập dữ liệu", "Dữ liệu không bị thay đổi", "Dữ liệu được sao lưu thường xuyên"],
        answer: "Chỉ những người được ủy quyền mới có quyền truy cập dữ liệu",
        hint: "Đây là một trong ba trụ cột chính của an toàn thông tin (CIA)."
    },
    {
        text: "Khái niệm 'Integrity' (Toàn vẹn) trong an toàn thông tin có nghĩa là gì?",
        options: ["Dữ liệu luôn có sẵn", "Chỉ những người được ủy quyền mới có quyền truy cập dữ liệu", "Dữ liệu không bị thay đổi hoặc phá hủy trái phép", "Dữ liệu được sao lưu thường xuyên"],
        answer: "Dữ liệu không bị thay đổi hoặc phá hủy trái phép",
        hint: "SHA-256 giúp đảm bảo điều này."
    },
    {
        text: "Thuật ngữ 'Phishing' mô tả kiểu tấn công nào?",
        options: ["Tấn công từ chối dịch vụ", "Lừa đảo để đánh cắp thông tin nhạy cảm (mật khẩu, thẻ tín dụng)", "Tiêm mã độc vào cơ sở dữ liệu", "Mã hóa dữ liệu và yêu cầu tiền chuộc"],
        answer: "Lừa đảo để đánh cắp thông tin nhạy cảm (mật khẩu, thẻ tín dụng)",
        hint: "Thường liên quan đến email hoặc tin nhắn giả mạo."
    },
    {
        text: "Mục đích chính của 'Tường lửa' (Firewall) là gì?",
        options: ["Mã hóa toàn bộ dữ liệu máy tính", "Ngăn chặn truy cập trái phép vào hoặc ra khỏi mạng", "Tạo bản sao lưu dữ liệu tự động", "Phục hồi dữ liệu bị hỏng"],
        answer: "Ngăn chặn truy cập trái phép vào hoặc ra khỏi mạng",
        hint: "Nó hoạt động như một rào cản."
    },
    {
        text: "Công nghệ 'SSL/TLS' được sử dụng chủ yếu để làm gì?",
        options: ["Tăng tốc độ Internet", "Bảo mật truyền thông giữa trình duyệt và máy chủ (HTTPS)", "Nén file", "Chặn quảng cáo"],
        answer: "Bảo mật truyền thông giữa trình duyệt và máy chủ (HTTPS)",
        hint: "Bạn thường thấy nó trên các trang web an toàn."
    },
    {
        text: "Một 'Zero-day exploit' là gì?",
        options: ["Một lỗ hổng bảo mật đã được biết đến rộng rãi", "Một cuộc tấn công đã được ngăn chặn trước khi xảy ra", "Một lỗ hổng bảo mật chưa được vá và kẻ tấn công đã phát hiện ra", "Một phần mềm diệt virus mới ra mắt"],
        answer: "Một lỗ hổng bảo mật chưa được vá và kẻ tấn công đã phát hiện ra",
        hint: "Các nhà phát triển chưa có 'ngày' để sửa nó."
    },
    {
        text: "Ransomware là gì?",
        options: ["Phần mềm theo dõi hoạt động người dùng", "Phần mềm mã hóa dữ liệu và yêu cầu tiền chuộc", "Một loại virus lây lan qua email", "Phần mềm giúp tăng tốc máy tính"],
        answer: "Phần mềm mã hóa dữ liệu và yêu cầu tiền chuộc",
        hint: "Nó 'bắt cóc' dữ liệu của bạn."
    },
    {
    "text": "RSA là một thuật toán dùng cho mục đích gì?",
    "options": ["Mã hóa đối xứng", "Băm dữ liệu", "Mã hóa bất đối xứng", "Nén dữ liệu"],
    "answer": "Mã hóa bất đối xứng",
    "hint": "Thuật toán này dùng cặp khóa công khai và riêng tư."
  },
  {
    "text": "Khóa riêng (private key) trong RSA được dùng để làm gì?",
    "options": ["Giải mã dữ liệu đã mã hóa bằng khóa công khai", "Tạo hash", "Mã hóa dữ liệu", "Tạo mã QR"],
    "answer": "Giải mã dữ liệu đã mã hóa bằng khóa công khai",
    "hint": "Khóa riêng tư dùng để giải mã trong hệ thống bất đối xứng."
  },
  {
    "text": "SHA-256 là thuật toán gì?",
    "options": ["Thuật toán mã hóa", "Thuật toán nén", "Thuật toán băm", "Thuật toán ký điện tử"],
    "answer": "Thuật toán băm",
    "hint": "Dùng để tạo chuỗi đầu ra có độ dài cố định từ dữ liệu đầu vào."
  },
  {
    "text": "Trong bảo mật, thuật ngữ 'Integrity' có nghĩa là gì?",
    "options": ["Mã hóa dữ liệu", "Tính toàn vẹn của dữ liệu", "Tốc độ xử lý", "Giấu thông tin người gửi"],
    "answer": "Tính toàn vẹn của dữ liệu",
    "hint": "Nó đảm bảo dữ liệu không bị thay đổi trái phép."
  },
  {
    "text": "Trong AES, có bao nhiêu kích thước khóa phổ biến?",
    "options": ["1", "2", "3", "4"],
    "answer": "3",
    "hint": "AES có các phiên bản 128-bit, 192-bit và 256-bit."
  },
  {
    "text": "Khóa công khai (public key) có thể được chia sẻ với ai?",
    "options": ["Chỉ người gửi", "Không ai cả", "Bất kỳ ai", "Chỉ người nhận"],
    "answer": "Bất kỳ ai",
    "hint": "Đây là điểm mạnh của hệ thống bất đối xứng."
  },
  {
    "text": "Mục đích chính của chữ ký số là gì?",
    "options": ["Giảm dung lượng dữ liệu", "Xác minh danh tính và toàn vẹn", "Giấu dữ liệu", "Tăng tốc xử lý"],
    "answer": "Xác minh danh tính và toàn vẹn",
    "hint": "Chữ ký số chứng minh người gửi và bảo vệ dữ liệu."
  },
  {
    "text": "Khi một hacker thực hiện tấn công 'Man-in-the-Middle', điều gì xảy ra?",
    "options": ["Chặn và sửa nội dung truyền giữa 2 bên", "DDoS", "Giả mạo DNS", "Quét cổng máy chủ"],
    "answer": "Chặn và sửa nội dung truyền giữa 2 bên",
    "hint": "Kẻ tấn công đứng giữa và nghe lén/gửi dữ liệu giả mạo."
  },
  {
    "text": "Thuật toán AES thuộc loại nào?",
    "options": ["Mã hóa đối xứng", "Mã hóa bất đối xứng", "Băm", "Nén"],
    "answer": "Mã hóa đối xứng",
    "hint": "AES dùng cùng một khóa để mã hóa và giải mã."
  },
  {
    "text": "Hash có thể được đảo ngược lại dữ liệu gốc không?",
    "options": ["Có", "Không", "Chỉ khi có khóa", "Chỉ với máy lượng tử"],
    "answer": "Không",
    "hint": "Hàm băm là một chiều – không thể đảo ngược."
  },
    {
    "text": "ECB trong AES có điểm yếu gì nghiêm trọng?",
    "options": [
      "Không hỗ trợ dữ liệu lớn",
      "Dữ liệu lặp sẽ sinh ra khối mã giống nhau",
      "Không tương thích với RSA",
      "Dễ bị mất toàn vẹn dữ liệu"
    ],
    "answer": "Dữ liệu lặp sẽ sinh ra khối mã giống nhau",
    "hint": "Đây là lý do tại sao ECB không được dùng trong thực tế."
  },
  {
    "text": "RSA trở nên yếu khi sử dụng khóa bao nhiêu bit trở xuống?",
    "options": [
      "4096-bit",
      "2048-bit",
      "1024-bit",
      "512-bit"
    ],
    "answer": "1024-bit",
    "hint": "Ngày nay khóa < 2048-bit được coi là rủi ro."
  },
  {
    "text": "Thuật toán Diffie-Hellman dùng để làm gì?",
    "options": [
      "Ký số",
      "Mã hóa văn bản",
      "Trao đổi khóa",
      "Băm dữ liệu"
    ],
    "answer": "Trao đổi khóa",
    "hint": "Nó cho phép hai bên chia sẻ khóa bí mật qua kênh không an toàn."
  },
  {
    "text": "Trong SHA-256, kích thước đầu ra luôn là bao nhiêu bit?",
    "options": [
      "128-bit",
      "160-bit",
      "256-bit",
      "512-bit"
    ],
    "answer": "256-bit",
    "hint": "Bất kể đầu vào dài bao nhiêu, đầu ra luôn cố định."
  },
  {
    "text": "Một tệp tin bị thay đổi một byte duy nhất. Hash SHA-256 của nó sẽ như thế nào?",
    "options": [
      "Thay đổi toàn bộ",
      "Thay đổi một phần nhỏ",
      "Không thay đổi",
      "Tăng thêm 1 byte"
    ],
    "answer": "Thay đổi toàn bộ",
    "hint": "Hàm băm có tính chất 'hiệu ứng cánh bướm'."
  },
  {
    "text": "Một hacker có thể dùng phương pháp nào để đoán khóa mật khẩu?",
    "options": [
      "Tấn công Brute-force",
      "Tấn công MITM",
      "Tấn công SQL Injection",
      "Tấn công DoS"
    ],
    "answer": "Tấn công Brute-force",
    "hint": "Dò từng khả năng một đến khi đúng."
  },
  {
    "text": "PGP là viết tắt của gì?",
    "options": [
      "Pretty Good Privacy",
      "Public Global Protection",
      "Private Guard Protocol",
      "Password Generator Program"
    ],
    "answer": "Pretty Good Privacy",
    "hint": "Một phần mềm mã hóa email nổi tiếng."
  },
  {
    "text": "Trong mã hóa bất đối xứng, điều gì xảy ra nếu khóa riêng bị lộ?",
    "options": [
      "Chữ ký số vẫn an toàn",
      "Dữ liệu mã hóa vẫn an toàn",
      "Toàn bộ hệ thống bị nguy hiểm",
      "Không vấn đề gì vì có khóa công khai"
    ],
    "answer": "Toàn bộ hệ thống bị nguy hiểm",
    "hint": "Khóa riêng phải được bảo vệ tuyệt đối."
  },
  {
    "text": "Sự khác biệt chính giữa AES và RSA là gì?",
    "options": [
      "AES dùng khóa dài hơn",
      "RSA nhanh hơn AES",
      "AES đối xứng, RSA bất đối xứng",
      "AES dùng cho chữ ký số"
    ],
    "answer": "AES đối xứng, RSA bất đối xứng",
    "hint": "Đây là sự khác biệt về cách dùng khóa."
  },
  {
    "text": "Khái niệm “nonce” trong mật mã học có nghĩa là gì?",
    "options": [
      "Một dạng thuật toán thay thế",
      "Một số chỉ dùng một lần",
      "Một loại khóa bí mật",
      "Một bước trong băm dữ liệu"
    ],
    "answer": "Một số chỉ dùng một lần",
    "hint": "Thường dùng để ngăn tấn công lặp (replay attack)."
  }
];
