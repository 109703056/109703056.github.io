
let words = [];
let shuffledWords = [];
let currentWord = "";
let currentIndex = 0;

let mode = "time";
let timeLeft = 0;
let timer = null;
let startTime = 0;

const wordDisplay = document.getElementById("wordDisplay");
const inputBox = document.getElementById("inputBox");
const resultDiv = document.getElementById("result");

// 載入字庫
function reload(){
    fetch("words.json")
        .then(res => res.json())
        .then(data => {
            words = data;
        });
}

// 隨機打亂陣列
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// 顯示下一個字
function nextWord() {
    if (mode === "time") {
        currentWord = words[Math.floor(Math.random() * words.length)];
    } else {
        if (currentIndex >= shuffledWords.length) {
            endAllMode();
            return;
        }
        currentWord = shuffledWords[currentIndex];
        currentIndex++;
    }

    wordDisplay.textContent = currentWord;
    inputBox.value = "";
    inputBox.focus();
}

// 計時模式結束
function endTimeMode(count, limit) {
    clearInterval(timer);
    resultDiv.innerHTML = `
        <p>時間到！</p>
        <p>輸入字數：${count} 個</p>
        <p>平均速度：${(count / (limit / 60)).toFixed(1)} WPM</p>
    `;
    document.getElementById("practiceArea").classList.add("hidden");
}

// 全部練習模式結束
function endAllMode() {
    let used = (Date.now() - startTime) / 1000;
    resultDiv.innerHTML = `
        <p>全部完成！</p>
        <p>總詞數：${words.length} 個</p>
        <p>花費時間：${used.toFixed(1)} 秒</p>
        <p>平均速度：${(words.length / (used / 60)).toFixed(1)} WPM</p>
    `;
    document.getElementById("practiceArea").classList.add("hidden");
}

// 開始按鈕
document.getElementById("startBtn").onclick = () => {
    reload();
    mode = document.querySelector("input[name='mode']:checked").value;
    resultDiv.innerHTML = "";
    currentIndex = 0;

    document.getElementById("practiceArea").classList.remove("hidden");

    if (mode === "time") {
        let limit = parseInt(document.getElementById("timeInput").value, 10);
        let count = 0;

        timeLeft = limit;
        resultDiv.textContent = `剩餘：${timeLeft} 秒`;

        nextWord();

        timer = setInterval(() => {
            timeLeft--;
            resultDiv.textContent = `剩餘：${timeLeft} 秒`;

            if (timeLeft <= 0) {
                endTimeMode(count, limit);
            }
        }, 1000);

        inputBox.oninput = () => {
            if (inputBox.value === currentWord) {
                count++;
                nextWord();
            }
        };

    } else {
        shuffledWords = shuffle([...words]);
        startTime = Date.now();
        nextWord();

        inputBox.oninput = () => {
            if (inputBox.value === currentWord) {
                nextWord();
            }
        };
    }
};

