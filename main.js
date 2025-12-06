let words = [];
let shuffledWords = [];
let currentWord = "";
let currentIndex = 0;

let mode = "time";
let timeLeft = 0;
let timer = null;
let startTime = 0;

const wordDisplay = document.getElementById("wordDisplay");
const codeDisplay = document.getElementById("codeDisplay");
const inputBox = document.getElementById("inputBox");
const resultDiv = document.getElementById("result");

// 小鶴雙拼碼表（簡化示例）
function getXiaoheCode(word) {
    const table = {
        "你": "ni",
        "好": "hao",
        "世": "shi",
        "界": "jie",
        "測": "ce",
        "試": "shi",
        "練": "lian",
        "習": "xi",
        "時": "shi",
        "間": "jian"
    };

    let code = "";
    for (let ch of word) {
        code += (table[ch] ?? "?") + " ";
    }
    return code.trim();
}

// 預載字庫
fetch("words.json")
    .then(res => res.json())
    .then(data => {
        words = data;
    });

// 打亂陣列
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

    if (document.getElementById("toggleCode").checked) {
        codeDisplay.textContent = getXiaoheCode(currentWord);
    } else {
        codeDisplay.textContent = "";
    }

    inputBox.value = "";
    inputBox.focus();
}

// 計時模式結束
function endTimeMode(count) {
    clearInterval(timer);
    resultDiv.innerHTML = `
        <p>時間到！</p>
        <p>總共輸入：${count} 個詞</p>
        <p>平均速度：${(count / (timeLeft / 60)).toFixed(1)} WPM</p>
    `;
}

// 全部模式結束
function endAllMode() {
    let used = (Date.now() - startTime) / 1000;
    resultDiv.innerHTML = `
        <p>全部完成！</p>
        <p>共 ${words.length} 個詞</p>
        <p>花費時間：${used.toFixed(1)} 秒</p>
        <p>平均速度：${(words.length / (used / 60)).toFixed(1)} WPM</p>
    `;
    document.getElementById("practiceArea").classList.add("hidden");
}

// 點擊開始
document.getElementById("startBtn").onclick = () => {
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
                endTimeMode(count);
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

// 小鶴碼表顯示開關
document.getElementById("toggleCode").onchange = () => {
    if (codeDisplay.textContent && !document.getElementById("toggleCode").checked) {
        codeDisplay.textContent = "";
    } else {
        codeDisplay.textContent = getXiaoheCode(currentWord);
    }
};
