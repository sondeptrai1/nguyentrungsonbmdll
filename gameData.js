// gameData.js
const GAME_CONFIG = {
    initialTime: 50, // Thời gian ban đầu cho mỗi giao dịch
    scorePerTransaction: 10, // Điểm nhận được cho mỗi giao dịch thành công
    scorePerCorrectPuzzle: 50, // Điểm nhận được khi giải đúng câu đố
    scorePenaltyPerWrongPuzzle: -30, // Điểm bị trừ khi giải sai câu đố
    scorePenaltyPerSkip: -50, // Điểm bị trừ khi bỏ qua giao dịch
    upgradeKeyCost: 100, // Chi phí nâng cấp khóa
    maxKeyLevel: 3, // Cấp độ khóa tối đa
    levelUpScore: [200, 500, 1000, 2000, 3500], // Điểm để lên cấp 2, 3, 4, 5, 6...
    hackChance: [0.25, 0.35, 0.5, 0.6, 0.7], // Tỷ lệ hack ở cấp 1, 2, 3, 4, 5
    tamperChance: [0.20, 0.30, 0.40, 0.5, 0.6], // Tỷ lệ giao dịch bị giả mạo ở cấp 1, 2, 3, 4, 5
    // Thêm các loại hack mới. Quan trọng: Mỗi loại hack cần có logic xử lý riêng trong main.js
    hackTypes: ['double_encrypt', 'wrong_key', 'fake_signature', 'sql_injection', 'malware_injection'],
    bossHackInterval: 4, // Cứ mỗi X giao dịch thành công sẽ có cơ hội gặp boss
};

let game = {
    playerName: '',
    score: 0,
    level: 1,
    combo: 0,
    transactionsCompleted: 0,
    puzzlesSolved: 0,
    keyLevel: 1, // Mức độ khóa: 1 (cơ bản), 2 (nâng cao), 3 (tối ưu)
    highScores: [], // Lưu trữ các điểm cao
    gameHistory: [], // Lưu trữ lịch sử các lần chơi
    consecutiveSuccessfulTransactions: 0, // Đếm số giao dịch thành công liên tiếp để kích hoạt boss
};
