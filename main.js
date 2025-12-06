let words = [];
let current = null;
let mode = "timed";
let timer = null;
let timeLeft = 0;
let finished = 0;

const startBtn = document.getElementById("startBtn");
const secondsInput = document.getElementById("secondsInput");
const inputBox = document.getElementById("inputBox");
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("statusText");
const currentWord = document.getElementById("currentWord");
const currentCode = document.getElementById("currentCode");
const toggleCode = document.getElementById("toggleCode");
const progressCount = document.getElementById("progressCount");

// ------------------------------
// 載入字庫
// ------------------------------
fetch("words.json")
    .then(res => res.json())
    .then(data => {
        words = data;
    });

// ------------------------------
// 開始練習
// ------------------------------
startBtn.addEventListener("click", () => {
    mode = document.querySelector("input[name='mode']:checked").value;
    finished = 0;
    progressCount.textContent = "已完成：0 個";

    if (mode === "timed") {
        timeLeft = Number(secondsInput.value);
        timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;
        timer = setInterval(countdown, 1000);
    } else {
        timerDisplay.textContent = "";
    }

    document.getElementById("practiceArea").classList.remove("hidden");
    inputBox.value = "";
    inputBox.focus();

    nextWord();
});

// ------------------------------
// 計時器
// ------------------------------
function countdown() {
    timeLeft--;
    timerDisplay.textContent = `剩餘時間：${timeLeft} 秒`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        statusText.textContent = `時間到！共完成 ${finished} 個詞`;
        inputBox.disabled = true;
    }
}

// ------------------------------
// 取得下一個詞
// ------------------------------
function nextWord() {
    current = words[Math.floor(Math.random() * words.length)];
    currentWord.textContent = current.word;
    currentCode.textContent = current.code;

    // // 小鶴碼顯示
    // if (toggleCode.checked) {
    //     currentCode.classList.remove("hidden");
    //     currentCode.textContent = current.code;
    // } else {
    //     currentCode.classList.add("hidden");
    // }
}

// ------------------------------
// 監聽輸入
// ------------------------------
inputBox.addEventListener("input", () => {
    if (!current) return;

    if (inputBox.value.trim() === current.word) {
        finished++;
        progressCount.textContent = `已完成：${finished} 個`;

        inputBox.value = "";
        nextWord();

        if (mode === "all" && finished >= words.length) {
            statusText.textContent = `全部完成！花費時間：${secondsInput.value - timeLeft} 秒`;
            inputBox.disabled = true;
        }
    }
});
