let currentTransaction = {};
let originalTransactionData = {}; 
let encryptedData = null;
let signature = null;
let originalHash = null;

let sentHash = null; 

let timeLeft = GAME_CONFIG.initialTime;
let timerInterval = null;
let lastAnimationFrameTime = 0; 

let isTampered = false; 
let isHacked = false;
let hackType = null; 
let isBossAttack = false; 

let hintUsed = false;
let puzzleAttemptedForCurrentTransaction = false; 
let currentPuzzle = null; 


const AES_KEY_PHRASE = '0123456789abcdef'; 
const AES_IV_PHRASE = 'abcdef9876543210';
const senderPrivateKey = 'sender_private_key_mock_for_rsa_signing'; // dùng để ký


const playerNameInput = document.getElementById('playerNameInput');
const startGameBtn = document.getElementById('startGameBtn');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const transactionIdEl = document.getElementById('transactionId');
const accountNumberEl = document.getElementById('accountNumber');
const amountEl = document.getElementById('amount');
const levelDisplayEl = document.getElementById('levelDisplay');
const scoreDisplayEl = document.getElementById('scoreDisplay');
const comboDisplayEl = document.getElementById('comboDisplay');
const upgradeDisplayEl = document.getElementById('upgradeDisplay');

const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');
const encryptBtn = document.getElementById('encryptBtn');
const signBtn = document.getElementById('signBtn');
const verifyBtn = document.getElementById('verifyBtn');
const nextBtn = document.getElementById('nextBtn');
const feedbackEl = document.getElementById('feedback');
const upgradeKeyBtn = document.getElementById('upgradeKeyBtn');
const decryptSection = document.getElementById('decryptSection');
const actionBtn = document.getElementById('actionBtn'); // Nút hành động trong decryptSection
const skipBtn = document.getElementById('skipBtn');
const welcomeModal = document.getElementById('welcomeModal');
const puzzleModal = document.getElementById('puzzleModal');
const puzzleTextEl = document.getElementById('puzzleText');
const puzzleOptionsEl = document.getElementById('puzzleOptions');
const puzzleFeedbackEl = document.getElementById('puzzleFeedback');
const hintBtn = document.getElementById('hintBtn');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreEl = document.getElementById('finalScore');
const finalLevelEl = document.getElementById('finalLevel'); // Đã sửa lỗi chính tả
const finalTransactionsEl = document.getElementById('finalTransactions');
const finalPuzzlesEl = document.getElementById('finalPuzzles');
const highScoresListEl = document.getElementById('highScoresList');
const gameHistoryBodyEl = document.getElementById('gameHistoryBody');
const playAgainBtn = document.getElementById('playAgainBtn');
const decryptMessage = document.getElementById('decryptMessage'); // Message trong decryptSection
const transactionCard = document.getElementById('transactionCard'); // Element của card giao dịch
const closePuzzleModalBtn = document.getElementById('closePuzzleModalBtn'); // Thêm dòng này

// --- Âm Thanh ---
const successSound = new Audio('https://freesound.org/data/previews/171/171671_2437358-lq.mp3');
const errorSound = new Audio('https://freesound.org/data/previews/395/395535_3232291-lq.mp3');
const upgradeSound = new Audio('https://freesound.org/data/previews/320/320655_4764823-lq.mp3');
const levelUpSound = new Audio('https://freesound.org/data/previews/387/387139_7077576-lq.mp3');
const hackSound = new Audio('https://freesound.org/data/previews/277/277028_4954752-lq.mp3');
const rejectSound = new Audio('https://freesound.org/data/previews/266/266914_4654877-lq.mp3'); // Âm thanh từ chối giao dịch
const bossSound = new Audio('https://freesound.org/data/previews/410/410651_3862217-lq.mp3'); // Âm thanh cho Boss

// --- Khởi Tạo Game ---
welcomeModal.style.display = 'flex'; // Hiển thị modal chào mừng khi tải trang

startGameBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        game.playerName = name;
        playerNameDisplay.textContent = game.playerName;
        welcomeModal.style.display = 'none';
        resetGame(); // Đặt lại trạng thái game về ban đầu
        generateTransaction(); // Bắt đầu giao dịch đầu tiên
        updateUI();
    } else {
        alert('Vui lòng nhập tên của bạn để bắt đầu!');
    }
});

playAgainBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    resetGame();
    generateTransaction();
    updateUI();
});

upgradeKeyBtn.addEventListener('click', upgradeKey);
encryptBtn.addEventListener('click', encryptTransaction);
signBtn.addEventListener('click', signTransaction);
verifyBtn.addEventListener('click', verifyIntegrity);
nextBtn.addEventListener('click', processNextTransaction);
skipBtn.addEventListener('click', skipTransaction);
hintBtn.addEventListener('click', useHint);
closePuzzleModalBtn.addEventListener('click', closePuzzleModalOnError); // Thêm event listener cho nút đóng

// --- Logic Game ---

/**
 * Đặt lại tất cả trạng thái game về ban đầu.
 */
function resetGame() {
    // Dừng timer hiện tại nếu có
    if (timerInterval) {
        cancelAnimationFrame(timerInterval);
        timerInterval = null;
    }

    game.score = 0;
    game.level = 1;
    game.combo = 0;
    game.transactionsCompleted = 0;
    game.puzzlesSolved = 0;
    game.keyLevel = 1;
    game.consecutiveSuccessfulTransactions = 0;

    timeLeft = GAME_CONFIG.initialTime;
    currentTransaction = {};
    originalTransactionData = {};
    encryptedData = null;
    signature = null;
    originalHash = null;
    isTampered = false;
    isHacked = false;
    hackType = null;
    isBossAttack = false;
    hintUsed = false;
    puzzleAttemptedForCurrentTransaction = false; // Reset cờ này

    feedbackEl.textContent = '';
    feedbackEl.className = '';
    decryptSection.classList.add('hidden');
    transactionCard.classList.remove('hack-effect', 'boss-attack');
}

/**
 * Tạo một giao dịch mới với khả năng bị tấn công hoặc giả mạo.
 */
function generateTransaction() {
    // Reset trạng thái giao dịch
    if (timerInterval) {
        cancelAnimationFrame(timerInterval);
        timerInterval = null;
    }
    encryptedData = null;
    signature = null;
    originalHash = null;
    isTampered = false;
    isHacked = false;
    hackType = null;
    hintUsed = false;
    puzzleAttemptedForCurrentTransaction = false; // Reset cờ này cho giao dịch mới
    decryptSection.classList.add('hidden');
    transactionCard.classList.remove('hack-effect', 'boss-attack');
    feedbackEl.textContent = ''; // Xóa phản hồi cũ

    const id = Math.random().toString(36).substr(2, 9).toUpperCase();
    const account = 'ACC' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const amount = (Math.random() * (1000 * game.level) + 50).toFixed(2);

    // Lưu trữ dữ liệu gốc và hash gốc
    originalTransactionData = { id, account, amount: parseFloat(amount).toFixed(2) };
    currentTransaction = { ...originalTransactionData }; // Bắt đầu với dữ liệu gốc
    originalHash = CryptoJS.SHA256(JSON.stringify(originalTransactionData)).toString();

    // Kiểm tra và tạo Boss Attack
    if (game.consecutiveSuccessfulTransactions >= GAME_CONFIG.bossHackInterval && Math.random() < 0.5) { // 50% cơ hội boss
        isBossAttack = true;
        isHacked = true;
        const bossHackTypes = ['malware_injection', 'double_encrypt'];
        hackType = bossHackTypes[Math.floor(Math.random() * bossHackTypes.length)];
        console.log("BOSS ATTACK! Type:", hackType);
        bossSound.play();
        feedbackEl.textContent = 'Cảnh báo: TẤN CÔNG CỦA TRÙM HACKER ĐÃ XẢY RA! Hệ thống đang bị xâm nhập!';
        feedbackEl.className = 'error animate-error';
        transactionCard.classList.add('boss-attack');
        game.consecutiveSuccessfulTransactions = 0; // Reset counter sau khi boss xuất hiện
    } else {
        isBossAttack = false;
        const currentHackChance = GAME_CONFIG.hackChance[game.level - 1] || GAME_CONFIG.hackChance[0];
        const currentTamperChance = GAME_CONFIG.tamperChance[game.level - 1] || GAME_CONFIG.tamperChance[0];

        isTampered = Math.random() < currentTamperChance;
        isHacked = Math.random() < currentHackChance;

        if (isHacked) {
            hackType = GAME_CONFIG.hackTypes[Math.floor(Math.random() * GAME_CONFIG.hackTypes.length)];
            hackSound.play();
            console.log("Hack Type:", hackType);
        } else {
            hackType = null;
        }

        if (isTampered) {
            currentTransaction.amount = (parseFloat(currentTransaction.amount) + Math.floor(Math.random() * 20 + 10)).toFixed(2);
            console.log("Giao dịch bị giả mạo số tiền:", originalTransactionData.amount, "->", currentTransaction.amount);
            feedbackEl.textContent = 'Cảnh báo: Phát hiện giả mạo dữ liệu! Cần kiểm tra toàn vẹn!';
            feedbackEl.className = 'error';
        }
    }

    // Áp dụng các hiệu ứng hack sau khi xác định hackType và isBossAttack
    if (isHacked) {
        if (hackType === 'wrong_key') {
            encryptedData = CryptoJS.AES.encrypt(JSON.stringify(originalTransactionData), 'wrongkey12345678', { iv: CryptoJS.enc.Utf8.parse(AES_IV_PHRASE) }).toString();
            console.log("Hack: Wrong Key Encryption");
        } else if (hackType === 'double_encrypt') {
            let temp = CryptoJS.AES.encrypt(JSON.stringify(originalTransactionData), CryptoJS.enc.Utf8.parse(AES_KEY_PHRASE), { iv: CryptoJS.enc.Utf8.parse(AES_IV_PHRASE) }).toString();
            encryptedData = CryptoJS.AES.encrypt(temp, CryptoJS.enc.Utf8.parse(AES_KEY_PHRASE), { iv: CryptoJS.enc.Utf8.parse(AES_IV_PHRASE) }).toString();
            console.log("Hack: Double Encryption");
        } else if (hackType === 'fake_signature') {
            signature = CryptoJS.SHA256(JSON.stringify(originalTransactionData) + 'fake_signing_key_by_hacker').toString();
            console.log("Hack: Fake Signature");
        } else if (hackType === 'sql_injection') {
            currentTransaction.account = originalTransactionData.account + "'; DROP TABLE Users; --";
            console.log("Hack: SQL Injection", currentTransaction.account);
        } else if (hackType === 'malware_injection') {
            currentTransaction.amount = (parseFloat(currentTransaction.amount) + Math.floor(Math.random() * 50 + 20)).toFixed(2); // thay đổi số tiền lớn hơn
            currentTransaction.malwareCode = "alert('Your system has been compromised!'); execute_malicious_script();";
            console.log("Hack: Malware Injection");
            feedbackEl.textContent = 'Cảnh báo: Mã độc đã được tiêm vào giao dịch! Cần làm sạch dữ liệu!';
            feedbackEl.className = 'error animate-error';
        }
    }

    if (hackType !== 'fake_signature') { // Nếu không phải hack chữ ký, thì chữ ký ban đầu là null
        signature = null;
    }

    timeLeft = GAME_CONFIG.initialTime;
    updateTimer();
    startTimer();
    updateUI();
}


/**
 * Cập nhật giao diện người dùng dựa trên trạng thái hiện tại của game.
 */
function updateUI() {
    transactionIdEl.textContent = currentTransaction.id;
    accountNumberEl.textContent = currentTransaction.account;
    amountEl.textContent = `${currentTransaction.amount} VND`;

    scoreDisplayEl.textContent = game.score;
    comboDisplayEl.textContent = game.combo;
    levelDisplayEl.textContent = game.level;
    upgradeDisplayEl.textContent = `Khóa Cấp ${game.keyLevel} (${game.keyLevel}x)`;
    playerNameDisplay.textContent = game.playerName;

    // Thay đổi màu nền theo cấp độ
    document.body.className = ''; // Reset class
    if (game.level === 2) {
        document.body.classList.add('level-2');
    } else if (game.level === 3) {
        document.body.classList.add('level-3');
    } else if (game.level === 4) {
        document.body.classList.add('level-4');
    } else if (game.level >= 5) {
        document.body.classList.add('level-5');
    }


    // Nút điều khiển chính
    // Các nút mã hóa, ký, xác minh chỉ nên bật khi giao dịch chưa bị hack/tamper HOẶC đã được xử lý xong
    const isTransactionCleanAfterHack = !isHacked && !isTampered;

    encryptBtn.disabled = !isTransactionCleanAfterHack || encryptedData !== null;
    signBtn.disabled = !isTransactionCleanAfterHack || encryptedData === null || signature !== null;
    verifyBtn.disabled = !isTransactionCleanAfterHack || signature === null;

    // NextBtn chỉ kích hoạt khi giao dịch hoàn toàn sạch VÀ đã qua các bước bảo mật cơ bản
    const isCompletedSteps = encryptedData !== null && signature !== null &&
                             (CryptoJS.SHA256(JSON.stringify(currentTransaction)).toString() === originalHash);

    nextBtn.disabled = !(isTransactionCleanAfterHack && isCompletedSteps);

    // Hiển thị phần xử lý hack/tamper
    if (isHacked || (isTampered && CryptoJS.SHA256(JSON.stringify(currentTransaction)).toString() !== originalHash)) {
        transactionCard.classList.add('hack-effect');
        if (isBossAttack) {
             transactionCard.classList.add('boss-attack'); // Thêm hiệu ứng boss
        }
        decryptSection.classList.remove('hidden');

        // Vô hiệu hóa các nút thông thường khi có sự cố
        encryptBtn.disabled = true;
        signBtn.disabled = true;
        verifyBtn.disabled = true;

        if (hackType === 'fake_signature') {
            decryptMessage.textContent = 'Cảnh báo: Chữ ký đã bị giả mạo! Giải câu đố để khôi phục.';
            actionBtn.textContent = 'Giải Câu Đố';
            actionBtn.onclick = showPuzzle;
            actionBtn.disabled = puzzleAttemptedForCurrentTransaction;
        } else if (hackType === 'sql_injection') {
            decryptMessage.textContent = 'Cảnh báo: Hacker tấn công! SQL Injection! Dữ liệu tài khoản đã bị thay đổi.';
            actionBtn.textContent = 'Làm sạch Dữ liệu';
            actionBtn.onclick = handleSqlInjectionHack;
            actionBtn.disabled = false; // Luôn bật nút này cho đến khi xử lý xong
        } else if (hackType === 'malware_injection') {
            decryptMessage.textContent = 'Cảnh báo: Mã độc đã được tiêm vào giao dịch! Cần làm sạch dữ liệu!';
            actionBtn.textContent = 'Làm sạch Mã Độc';
            actionBtn.onclick = handleMalwareInjectionHack;
            actionBtn.disabled = false; // Luôn bật nút này cho đến khi xử lý xong
        } else if (isHacked && (hackType === 'double_encrypt' || hackType === 'wrong_key')) {
            decryptMessage.textContent = `Cảnh báo: Hacker tấn công! (${hackType === 'double_encrypt' ? 'Mã hóa kép' : 'Khóa sai'})! Giải câu đố để khôi phục.`;
            actionBtn.textContent = 'Giải Câu Đố';
            actionBtn.onclick = showPuzzle;
            actionBtn.disabled = puzzleAttemptedForCurrentTransaction;
        } else if (isTampered && CryptoJS.SHA256(JSON.stringify(currentTransaction)).toString() !== originalHash) {
            decryptMessage.textContent = `Cảnh báo: Giao dịch bị giả mạo! Toàn vẹn thất bại! Giao dịch đã bị thay đổi! Giải câu đố để khôi phục.`;
            actionBtn.textContent = 'Giải Câu Đố';
            actionBtn.onclick = showPuzzle;
            actionBtn.disabled = puzzleAttemptedForCurrentTransaction;
        }
        // Nút Skip luôn khả dụng khi có vấn đề chưa giải quyết
        skipBtn.disabled = false;
    } else {
        // Nếu không có hack hay giả mạo chưa xử lý, ẩn phần decrypt
        decryptSection.classList.add('hidden');
        transactionCard.classList.remove('hack-effect', 'boss-attack');
        // Nút skip chỉ khả dụng khi đang ở trạng thái bình thường (chưa thực hiện bất cứ bước nào)
        skipBtn.disabled = encryptedData !== null;
    }

    upgradeKeyBtn.disabled = game.score < GAME_CONFIG.upgradeKeyCost || game.keyLevel >= GAME_CONFIG.maxKeyLevel;
}

/**
 * Cập nhật hiển thị thời gian còn lại và thanh tiến độ.
 */
function updateTimer() {
    timerEl.textContent = Math.ceil(timeLeft);
    progressEl.style.width = `${(timeLeft / GAME_CONFIG.initialTime) * 100}%`;
    progressEl.style.setProperty('--progress-width', `${(timeLeft / GAME_CONFIG.initialTime) * 100}%`); /* For animation */

    if (timeLeft < GAME_CONFIG.initialTime / 3) {
        progressEl.style.backgroundColor = '#ef4444'; // Red
    } else if (timeLeft < GAME_CONFIG.initialTime / 2) {
        progressEl.style.backgroundColor = '#facc15'; // Yellow
    } else {
        progressEl.style.backgroundColor = '#3b82f6'; // Blue
    }
}

/**
 * Bắt đầu bộ đếm thời gian cho giao dịch.
 */
function startTimer() {
    if (timerInterval) { // Đảm bảo chỉ có một timer chạy
        cancelAnimationFrame(timerInterval);
    }
    lastAnimationFrameTime = performance.now(); // Khởi tạo thời gian bắt đầu

    function tick(currentTime) {
        const delta = (currentTime - lastAnimationFrameTime) / 1000; // Thời gian trôi qua từ lần cuối (giây)
        timeLeft = Math.max(0, timeLeft - delta);
        updateTimer();
        if (timeLeft <= 0) {
            feedbackEl.textContent = 'Hết thời gian! Giao dịch thất bại!';
            feedbackEl.className = 'error animate-error';
            errorSound.play();
            endGame(); // Kết thúc game khi hết giờ
        } else {
            timerInterval = requestAnimationFrame(tick); // Tiếp tục gọi tick ở frame tiếp theo
        }
        lastAnimationFrameTime = currentTime;
    }
    timerInterval = requestAnimationFrame(tick); // Bắt đầu vòng lặp animation
}

/**
 * Xử lý khi người chơi trả lời sai hoặc muốn thoát khỏi puzzle modal khi có lỗi.
 */
function closePuzzleModalOnError() {
    puzzleModal.style.display = 'none';
    feedbackEl.textContent = 'Bạn đã không giải được vấn đề. Hãy bỏ qua giao dịch này!';
    feedbackEl.className = 'error';
    errorSound.play();
    actionBtn.disabled = true; // Vô hiệu hóa nút hành động nếu người chơi bỏ qua/sai
    updateUI();
}

/**
 * Hiển thị modal câu đố để người chơi giải.
 */
function showPuzzle() {
    if (puzzleAttemptedForCurrentTransaction) {
        puzzleFeedbackEl.textContent = 'Bạn đã trả lời sai câu đố này. Vui lòng thoát (x) hoặc bỏ qua giao dịch.';
        puzzleFeedbackEl.className = 'error';
        closePuzzleModalBtn.classList.remove('hidden'); // Đảm bảo nút X hiển thị nếu đã sai
        actionBtn.disabled = true;
        return;
    }
    // Ẩn nút đóng ban đầu
    closePuzzleModalBtn.classList.add('hidden');

    currentPuzzle = gamePuzzles[Math.floor(Math.random() * gamePuzzles.length)];
    puzzleTextEl.textContent = currentPuzzle.text;
    puzzleOptionsEl.innerHTML = '';
    hintUsed = false;

    const shuffledOptions = [...currentPuzzle.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; /* Sử dụng class chung để style */
        btn.textContent = option;
        btn.addEventListener('click', () => checkPuzzleAnswer(option, currentPuzzle.answer));
        puzzleOptionsEl.appendChild(btn);
    });
    hintBtn.disabled = game.score < 20 || hintUsed;
    puzzleModal.style.display = 'flex';
    puzzleFeedbackEl.textContent = '';
    updateUI();
}

/**
 * Xử lý khi người chơi sử dụng gợi ý.
 */
function useHint() {
    if (game.score >= 20 && !hintUsed && currentPuzzle && !puzzleAttemptedForCurrentTransaction) {
        addScore(-20); // Mất 20 điểm cho gợi ý
        hintUsed = true;

        const wrongOptions = currentPuzzle.options.filter(opt => opt !== currentPuzzle.answer);

        if (wrongOptions.length > 0) {
            // Loại bỏ một lựa chọn sai
            const optionToDisable = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
            const buttons = puzzleOptionsEl.querySelectorAll('.option-btn'); /* Sử dụng class chung */
            buttons.forEach(btn => {
                if (btn.textContent === optionToDisable) {
                    btn.disabled = true;
                    btn.classList.remove('bg-blue-500', 'hover:bg-blue-600'); /* Xóa các class cũ */
                    btn.classList.add('bg-gray-300', 'cursor-not-allowed'); /* Thêm class mới */
                }
            });
            puzzleFeedbackEl.textContent = `Một lựa chọn sai đã bị loại bỏ! (-20 điểm)`;
            puzzleFeedbackEl.className = 'feedback';
        }
        hintBtn.disabled = true; // Vô hiệu hóa nút gợi ý sau khi dùng
        updateUI();
    } else {
        puzzleFeedbackEl.textContent = 'Không thể dùng gợi ý lúc này.';
        puzzleFeedbackEl.className = 'error';
    }
}

/**
 * Kiểm tra câu trả lời của người chơi cho câu đố.
 * @param {string} selected - Lựa chọn của người chơi.
 * @param {string} answer - Câu trả lời đúng.
 */
function checkPuzzleAnswer(selected, answer) {
    if (puzzleAttemptedForCurrentTransaction) {
        // Nút X đã có thể dùng, không cần thêm thông báo
        return;
    }
    puzzleAttemptedForCurrentTransaction = true; // Đánh dấu đã cố gắng giải

    const optionButtons = puzzleOptionsEl.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true); // Vô hiệu hóa tất cả các nút tùy chọn
    hintBtn.disabled = true; // Vô hiệu hóa nút gợi ý

    if (selected === answer) {
        puzzleFeedbackEl.textContent = 'Trả lời đúng! Giao dịch đang được khôi phục...';
        puzzleFeedbackEl.className = 'feedback animate-success';
        successSound.play();
        addScore(GAME_CONFIG.scorePerCorrectPuzzle * game.keyLevel * (game.combo + 1)); // Cộng điểm khi giải đúng
        incrementPuzzlesSolved();

        // Ẩn nút đóng khi trả lời đúng
        closePuzzleModalBtn.classList.add('hidden');

        setTimeout(() => {
            puzzleModal.style.display = 'none';
            try {
                if (hackType === 'double_encrypt') {
                    // Giải mã lần 1
                    const bytes1 = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(AES_KEY_PHRASE), { iv: CryptoJS.enc.Utf8.parse(AES_IV_PHRASE) });
                    const tempDecrypted = bytes1.toString(CryptoJS.enc.Utf8);
                    // Giải mã lần 2
                    const bytes2 = CryptoJS.AES.decrypt(tempDecrypted, CryptoJS.enc.Utf8.parse(AES_KEY_PHRASE), { iv: CryptoJS.enc.Utf8.parse(AES_IV_PHRASE) });
                    currentTransaction = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));
                    encryptedData = null; // Dữ liệu đã được giải mã về trạng thái gốc, bỏ mã hóa
                    feedbackEl.textContent = `Giải mã kép thành công! Giao dịch đã được khôi phục!`;
                } else if (hackType === 'wrong_key') {
                    // Giải mã bằng khóa đúng
                    const bytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(AES_KEY_PHRASE), { iv: CryptoJS.enc.Utf8.parse(AES_IV_PHRASE) });
                    currentTransaction = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    encryptedData = null; // Dữ liệu đã được giải mã về trạng thái gốc, bỏ mã hóa
                    feedbackEl.textContent = `Giải mã khóa sai thành công! Giao dịch đã được khôi phục!`;
                } else if (hackType === 'fake_signature') {
                    signature = null; // Vô hiệu hóa chữ ký giả mạo, cho phép ký lại
                    feedbackEl.textContent = `Chữ ký giả mạo đã được phát hiện và vô hiệu hóa! Bạn có thể ký lại giao dịch.`;
                } else if (isTampered) { // Nếu chỉ bị giả mạo dữ liệu và chưa được xử lý
                    currentTransaction = { ...originalTransactionData }; // Khôi phục về dữ liệu gốc
                    feedbackEl.textContent = `Giao dịch đã được khôi phục về trạng thái gốc!`;
                }
                // Dù là loại hack nào, sau khi giải đố thành công, reset trạng thái hack
                isHacked = false;
                isTampered = false; // Đảm bảo cả tamper cũng được reset nếu giải đố
                hackType = null;
                isBossAttack = false; // Reset cờ boss
                transactionCard.classList.remove('hack-effect', 'boss-attack');
                decryptSection.classList.add('hidden'); // Ẩn phần xử lý hack
                updateUI();
            } catch (e) {
                console.error("Lỗi giải mã/khôi phục sau câu đố:", e);
                feedbackEl.textContent = `Lỗi nghiêm trọng trong quá trình khôi phục giao dịch! Vui lòng bỏ qua.`;
                feedbackEl.className = 'error';
                errorSound.play();
                // Nếu có lỗi nghiêm trọng khi khôi phục, coi như không giải quyết được hack
                // và người chơi phải bỏ qua giao dịch.
                // Đảm bảo các cờ hack vẫn giữ nguyên để người chơi biết cần bỏ qua
                closePuzzleModalBtn.classList.remove('hidden'); // Hiển thị nút X
                actionBtn.disabled = true; // Vô hiệu hóa nút hành động
            }
        }, 1500); // Đợi 1.5 giây để người chơi đọc phản hồi
    } else {
        puzzleFeedbackEl.textContent = 'Trả lời sai! Vui lòng nhấn (x) để thoát và bỏ qua giao dịch.';
        puzzleFeedbackEl.className = 'error animate-error';
        errorSound.play();
        addScore(GAME_CONFIG.scorePenaltyPerWrongPuzzle); // Trừ điểm khi trả lời sai
        // Sau khi trả lời sai, người chơi không thể thử lại câu đố này cho giao dịch hiện tại
        closePuzzleModalBtn.classList.remove('hidden'); // Hiển thị nút đóng
        actionBtn.disabled = true; // Khóa nút giải đố
        feedbackEl.textContent = 'Bạn đã trả lời sai câu đố! Hãy bỏ qua giao dịch này để tránh mất thêm điểm.';
        feedbackEl.className = 'error';
        updateUI();
    }
}

/**
 * Xử lý hack SQL Injection bằng cách làm sạch chuỗi tài khoản.
 */
function handleSqlInjectionHack() {
    const originalAccount = originalTransactionData.account;
    // Kiểm tra xem chuỗi có chứa dấu hiệu SQL Injection không
    if (currentTransaction.account.includes("'; DROP TABLE Users; --")) {
        currentTransaction.account = originalAccount; // Khôi phục về số tài khoản gốc
        isHacked = false; // Đánh dấu hack đã xử lý
        hackType = null;
        isBossAttack = false; // Reset cờ boss
        transactionCard.classList.remove('hack-effect', 'boss-attack');
        decryptSection.classList.add('hidden');
        addScore(50 * game.level * game.keyLevel * (game.combo + 1));
        feedbackEl.textContent = 'SQL Injection đã được làm sạch! Giao dịch an toàn trở lại.';
        feedbackEl.className = 'feedback animate-success';
        successSound.play();
        updateUI();
    } else {
        feedbackEl.textContent = 'Không có dấu vết SQL Injection để làm sạch.';
        feedbackEl.className = 'error';
        errorSound.play();
    }
}

/**
 * Xử lý hack Malware Injection bằng cách loại bỏ mã độc và khôi phục số tiền.
 */
function handleMalwareInjectionHack() {
    if (currentTransaction.malwareCode) {
        delete currentTransaction.malwareCode; // Loại bỏ mã độc
        currentTransaction.amount = originalTransactionData.amount; // Khôi phục số tiền gốc
        isHacked = false; // Đánh dấu hack đã xử lý
        hackType = null;
        isBossAttack = false; // Reset cờ boss
        transactionCard.classList.remove('hack-effect', 'boss-attack');
        decryptSection.classList.add('hidden');
        addScore(75 * game.level * game.keyLevel * (game.combo + 1)); // Nhiều điểm hơn vì là boss
        feedbackEl.textContent = 'Mã độc đã được loại bỏ và giao dịch khôi phục! Rất tốt!';
        feedbackEl.className = 'feedback animate-success';
        successSound.play();
        updateUI();
    } else {
        feedbackEl.textContent = 'Không có mã độc trong giao dịch này.';
        feedbackEl.className = 'error';
        errorSound.play();
    }
}


/**
 * Mã hóa dữ liệu giao dịch bằng AES.
 */
function encryptTransaction() {
    if (encryptedData) {
        feedbackEl.textContent = 'Giao dịch đã được mã hóa!';
        feedbackEl.className = 'error';
        errorSound.play();
        return;
    }
    // Chỉ mã hóa khi không có hack chưa xử lý
    if (isHacked || (isTampered && CryptoJS.SHA256(JSON.stringify(currentTransaction)).toString() !== originalHash)) {
        feedbackEl.textContent = 'Vui lòng xử lý vấn đề bảo mật trước khi mã hóa!';
        feedbackEl.className = 'error animate-error';
        errorSound.play();
        return;
    }

    try {
        const key = CryptoJS.enc.Utf8.parse(AES_KEY_PHRASE);
        const iv = CryptoJS.enc.Utf8.parse(AES_IV_PHRASE);
        encryptedData = CryptoJS.AES.encrypt(JSON.stringify(currentTransaction), key, { iv: iv }).toString();
        feedbackEl.textContent = 'Mã hóa AES thành công!';
        feedbackEl.className = 'feedback animate-success';
        successSound.play();
        addScore(10 * game.keyLevel); // Thêm điểm dựa trên cấp độ khóa
        updateUI();
    } catch (e) {
        feedbackEl.textContent = 'Lỗi mã hóa: ' + e.message;
        feedbackEl.className = 'error animate-error';
        errorSound.play();
    }
}

/**
 * Ký giao dịch bằng RSA (mô phỏng) và tạo hash.
 */
function signTransaction() {
    if (!encryptedData) {
        feedbackEl.textContent = 'Vui lòng mã hóa giao dịch trước!';
        feedbackEl.className = 'error';
        errorSound.play();
        return;
    }
    if (signature) {
        feedbackEl.textContent = 'Giao dịch đã được ký!';
        feedbackEl.className = 'error';
        errorSound.play();
        return;
    }
    // Chỉ ký khi không có hack chưa xử lý
    if (isHacked || (isTampered && CryptoJS.SHA256(JSON.stringify(currentTransaction)).toString() !== originalHash)) {
        feedbackEl.textContent = 'Vui lòng xử lý vấn đề bảo mật trước khi ký!';
        feedbackEl.className = 'error animate-error';
        errorSound.play();
        return;
    }

    try {
        // Tạo hash của dữ liệu đã mã hóa để ký
        sentHash = CryptoJS.SHA256(encryptedData).toString();
        // Giả lập việc ký bằng private key của người gửi
        // Trong thực tế, đây sẽ là một quá trình phức tạp hơn nhiều với RSA
        signature = CryptoJS.SHA256(sentHash + senderPrivateKey).toString(); // Chữ ký đơn giản hóa
        feedbackEl.textContent = 'Ký giao dịch thành công!';
        feedbackEl.className = 'feedback animate-success';
        successSound.play();
        addScore(15 * game.keyLevel);
        updateUI();
    } catch (e) {
        feedbackEl.textContent = 'Lỗi khi ký giao dịch: ' + e.message;
        feedbackEl.className = 'error animate-error';
        errorSound.play();
    }
}

/**
 * Xác minh tính toàn vẹn và chữ ký của giao dịch.
 */
function verifyIntegrity() {
    if (!signature) {
        feedbackEl.textContent = 'Vui lòng ký giao dịch trước!';
        feedbackEl.className = 'error';
        errorSound.play();
        return;
    }
    if (!encryptedData) {
        feedbackEl.textContent = 'Dữ liệu chưa được mã hóa đầy đủ để xác minh!';
        feedbackEl.className = 'error';
        errorSound.play();
        return;
    }
    // Chỉ xác minh khi không có hack chưa xử lý
    if (isHacked || (isTampered && CryptoJS.SHA256(JSON.stringify(currentTransaction)).toString() !== originalHash)) {
        feedbackEl.textContent = 'Vui lòng xử lý vấn đề bảo mật trước khi xác minh!';
        feedbackEl.className = 'error animate-error';
        errorSound.play();
        return;
    }

    let integrityCheckPassed = false;
    let signatureCheckPassed = false;

    try {
        // Bước 1: Xác minh chữ ký RSA (mô phỏng)
        // Trong môi trường thực tế, bạn sẽ dùng public key để giải mã signature.
        // Ở đây, chúng ta mô phỏng bằng cách tái tạo hash mà chữ ký được tạo ra.
        const expectedHashFromSignature = CryptoJS.SHA256(sentHash + senderPrivateKey).toString();

        if (signature === expectedHashFromSignature) {
            signatureCheckPassed = true;
        } else {
            feedbackEl.textContent = 'Từ chối giao dịch: Chữ ký không hợp lệ hoặc bị giả mạo!';
            feedbackEl.className = 'error animate-error';
            rejectSound.play();
            addScore(-game.combo * 10 - 20); // Phạt nặng hơn
            game.combo = 0; // Reset combo
            updateUI();
            return;
        }

        // Bước 2: Kiểm tra tính toàn vẹn dữ liệu bằng SHA-256 của encryptedData
        // Đảm bảo rằng dữ liệu đã mã hóa không bị thay đổi sau khi ký
        const receivedHashOfEncryptedData = CryptoJS.SHA256(encryptedData).toString();

        if (receivedHashOfEncryptedData === sentHash) {
            integrityCheckPassed = true;
            // Dữ liệu mã hóa không bị thay đổi, giờ thử giải mã và kiểm tra dữ liệu gốc
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(AES_KEY_PHRASE), { iv: CryptoJS.enc.Utf8.parse(AES_IV_PHRASE) });
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

            // Bước 3: Kiểm tra tính toàn vẹn của dữ liệu gốc sau khi giải mã
            const finalDataHash = CryptoJS.SHA256(JSON.stringify(decryptedData)).toString();

            if (finalDataHash === originalHash) {
                feedbackEl.textContent = 'Xác minh thành công! Toàn vẹn dữ liệu đảm bảo.';
                feedbackEl.className = 'feedback animate-success';
                successSound.play();
                addScore(20 * game.keyLevel);
            } else {
                feedbackEl.textContent = 'Từ chối giao dịch: Dữ liệu đã bị giả mạo trước khi mã hóa hoặc trong quá trình truyền!';
                feedbackEl.className = 'error animate-error';
                rejectSound.play();
                addScore(-game.combo * 10 - 20);
                game.combo = 0;
            }

        } else {
            feedbackEl.textContent = 'Từ chối giao dịch: Dữ liệu đã bị thay đổi SAU khi ký! (Hash mã hóa không khớp)';
            feedbackEl.className = 'error animate-error';
            rejectSound.play();
            addScore(-game.combo * 10 - 20);
            game.combo = 0;
        }
        updateUI();
    } catch (e) {
        console.error("Lỗi xác minh:", e);
        feedbackEl.textContent = 'Lỗi xác minh: ' + e.message;
        feedbackEl.className = 'error animate-error';
        errorSound.play();
        addScore(-game.combo * 10 - 20);
        game.combo = 0;
        updateUI();
    }
}


/**
 * Xử lý chuyển sang giao dịch tiếp theo.
 */
function processNextTransaction() {
    // Điều kiện để hoàn thành giao dịch (đã mã hóa, đã ký, và không có lỗi chưa xử lý, và dữ liệu gốc khớp)
    const isCleanAndProcessed = !isHacked && !isTampered && encryptedData !== null && signature !== null &&
                                CryptoJS.SHA256(JSON.stringify(currentTransaction)).toString() === originalHash;

    if (isCleanAndProcessed) {
        game.transactionsCompleted++;
        game.consecutiveSuccessfulTransactions++; // Tăng bộ đếm giao dịch thành công liên tiếp
        addScore(GAME_CONFIG.scorePerTransaction * game.level * game.keyLevel * (game.combo + 1)); // Cộng điểm combo
        game.combo++; // Tăng combo
        checkLevelUp();
        generateTransaction(); // Tạo giao dịch mới
        updateUI();
    } else {
        feedbackEl.textContent = 'Chưa hoàn tất các bước bảo mật hoặc giao dịch có vấn đề chưa được xử lý!';
        feedbackEl.className = 'error animate-error';
        errorSound.play();
        game.combo = 0; // Reset combo nếu cố gắng chuyển khi chưa hoàn thành
        updateUI();
    }
}

/**
 * Bỏ qua giao dịch hiện tại (mất điểm).
 */
function skipTransaction() {
    if (game.score >= Math.abs(GAME_CONFIG.scorePenaltyPerSkip)) {
        addScore(GAME_CONFIG.scorePenaltyPerSkip); // Mất điểm khi bỏ qua
        game.combo = 0; // Reset combo
        feedbackEl.textContent = `Giao dịch đã bị bỏ qua. (-${Math.abs(GAME_CONFIG.scorePenaltyPerSkip)} điểm)`;
        feedbackEl.className = 'error';
        rejectSound.play();
        generateTransaction(); // Tạo giao dịch mới
        updateUI();
    } else {
        feedbackEl.textContent = 'Không đủ điểm để bỏ qua giao dịch! Cần 50 điểm.';
        feedbackEl.className = 'error';
        errorSound.play();
    }
}

/**
 * Thêm hoặc trừ điểm và cập nhật hiển thị.
 * @param {number} points - Số điểm cần thêm (có thể âm).
 */
function addScore(points) {
    game.score += points;
    if (game.score < 0) game.score = 0; // Không cho điểm âm
    scoreDisplayEl.textContent = game.score;
}

/**
 * Tăng số lượng câu đố đã giải và cập nhật.
 */
function incrementPuzzlesSolved() {
    game.puzzlesSolved++;
}

/**
 * Kiểm tra và nâng cấp cấp độ game.
 */
function checkLevelUp() {
    // Kiểm tra xem có còn cấp độ để lên không
    if (game.level < GAME_CONFIG.levelUpScore.length) {
        const scoreNeededForNextLevel = GAME_CONFIG.levelUpScore[game.level - 1]; // Điểm cần để lên cấp tiếp theo

        if (game.score >= scoreNeededForNextLevel) {
            game.level++;
            levelUpSound.play();
            feedbackEl.textContent = `Lên cấp ${game.level}! Hệ thống bảo mật mạnh mẽ hơn!`;
            feedbackEl.className = 'feedback animate-success';
            updateUI(); // Cập nhật UI để phản ánh cấp độ mới
        }
    }
}

/**
 * Nâng cấp khóa mã hóa.
 */
function upgradeKey() {
    if (game.score >= GAME_CONFIG.upgradeKeyCost && game.keyLevel < GAME_CONFIG.maxKeyLevel) {
        addScore(-GAME_CONFIG.upgradeKeyCost);
        game.keyLevel++;
        upgradeSound.play();
        feedbackEl.textContent = `Nâng cấp khóa thành công lên cấp ${game.keyLevel}! Tăng hiệu quả và điểm!`;
        feedbackEl.className = 'feedback animate-success';
        updateUI();
    } else if (game.keyLevel >= GAME_CONFIG.maxKeyLevel) {
        feedbackEl.textContent = 'Khóa đã đạt cấp độ tối đa!';
        feedbackEl.className = 'error';
    } else {
        feedbackEl.textContent = `Không đủ điểm để nâng cấp khóa! Cần ${GAME_CONFIG.upgradeKeyCost} điểm.`;
        feedbackEl.className = 'error animate-error';
        errorSound.play();
    }
}

/**
 * Kết thúc trò chơi và hiển thị màn hình điểm số.
 */
function endGame() {
    if (timerInterval) {
        cancelAnimationFrame(timerInterval);
        timerInterval = null;
    }

    finalScoreEl.textContent = game.score;
    finalLevelEl.textContent = game.level;
    finalTransactionsEl.textContent = game.transactionsCompleted;
    finalPuzzlesEl.textContent = game.puzzlesSolved;

    // Lưu điểm và lịch sử
    const gameResult = {
        name: game.playerName,
        score: game.score,
        level: game.level,
        transactions: game.transactionsCompleted,
        puzzles: game.puzzlesSolved,
        date: new Date().toLocaleString()
    };
    // Cập nhật High Scores
    const storedHighScores = JSON.parse(localStorage.getItem('highScores')) || [];
    storedHighScores.push(gameResult);
    storedHighScores.sort((a, b) => b.score - a.score); // Sắp xếp giảm dần theo điểm
    game.highScores = storedHighScores.slice(0, 5); // Giữ top 5
    localStorage.setItem('highScores', JSON.stringify(game.highScores));

    // Cập nhật Game History
    const storedGameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    storedGameHistory.unshift(gameResult); // Thêm vào đầu lịch sử (mới nhất ở trên)
    game.gameHistory = storedGameHistory.slice(0, 10); // Giữ 10 lần chơi gần nhất
    localStorage.setItem('gameHistory', JSON.stringify(game.gameHistory));

    displayHighScores();
    displayGameHistory();

    gameOverModal.style.display = 'flex';
}

/**
 * Hiển thị bảng xếp hạng điểm cao.
 */
function displayHighScores() {
    highScoresListEl.innerHTML = '';
    const storedScores = JSON.parse(localStorage.getItem('highScores')) || [];
    storedScores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name} - Điểm: ${entry.score} (Cấp ${entry.level})`;
        highScoresListEl.appendChild(li);
    });
}

/**
 * Hiển thị lịch sử chơi gần đây.
 */
function displayGameHistory() {
    gameHistoryBodyEl.innerHTML = '';
    const storedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    storedHistory.forEach(entry => {
        const row = gameHistoryBodyEl.insertRow();
        row.insertCell().textContent = entry.name;
        row.insertCell().textContent = entry.score;
        row.insertCell().textContent = entry.level;
        row.insertCell().textContent = entry.transactions;
        row.insertCell().textContent = entry.puzzles;
        row.insertCell().textContent = entry.date;
    });
}

// Gọi hàm hiển thị lịch sử và điểm cao khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    displayHighScores();
    displayGameHistory();
});
