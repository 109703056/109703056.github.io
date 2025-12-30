let words = [];
let remainingWords = [];
let currentWord = "";
let timer = null;
let timeLeft = 0;

const wordDisplay = document.getElementById("wordDisplay");
const inputBox = document.getElementById("inputBox");
const remainingCount = document.getElementById("remainingCount");
const timerDisplay = document.getElementById("timer");
const practiceArea = document.getElementById("practice");
const startBtn = document.getElementById("startBtn");
const timeInput = document.getElementById("timeInput");

fetch("words.json")
  .then(res => res.json())
  .then(data => {
    words = data;
  });

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function nextWord() {
  if (remainingWords.length === 0) {
    endPractice();
    return;
  }

  currentWord = remainingWords.pop();
  wordDisplay.textContent = currentWord;
  remainingCount.textContent = remainingWords.length;
  inputBox.value = "";
}

function startPractice() {
  practiceArea.classList.remove("hidden");

  remainingWords = [...words];
  shuffle(remainingWords);

  remainingCount.textContent = remainingWords.length;
  nextWord();

  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (mode === "time") {
    timeLeft = Number(timeInput.value);
    timerDisplay.textContent = `剩餘時間：${timeLeft}s`;

    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `剩餘時間：${timeLeft}s`;

      if (timeLeft <= 0) {
        endPractice();
      }
    }, 1000);
  } else {
    timerDisplay.textContent = "";
  }
}

function endPractice() {
  clearInterval(timer);
  alert("練習結束！");
  practiceArea.classList.add("hidden");
}

inputBox.addEventListener("input", () => {
  if (inputBox.value === currentWord) {
    nextWord();
  }
});

startBtn.addEventListener("click", startPractice);
