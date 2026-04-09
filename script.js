let questions = [];
let currentQ = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const progress = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

// Sound effects
const correctSound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
const wrongSound = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");

// Load from API
async function loadQuestions() {
  const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
  const data = await res.json();

  questions = data.results.map(q => {
    const answers = [...q.incorrect_answers];
    answers.splice(Math.floor(Math.random() * 4), 0, q.correct_answer);

    return {
      question: q.question,
      answers: answers,
      correct: answers.indexOf(q.correct_answer)
    };
  });

  loadQuestion();
}

function loadQuestion() {
  resetTimer();
  const q = questions[currentQ];
  questionEl.innerHTML = q.question;
  answersEl.innerHTML = "";

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.innerHTML = ans;
    btn.onclick = () => selectAnswer(i);
    answersEl.appendChild(btn);
  });

  updateProgress();
}

function selectAnswer(i) {
  clearInterval(timer);
  const correctIndex = questions[currentQ].correct;
  const buttons = answersEl.children;

  for (let b = 0; b < buttons.length; b++) {
    buttons[b].disabled = true;
    if (b === correctIndex) buttons[b].classList.add("correct");
    if (b === i && b !== correctIndex) buttons[b].classList.add("wrong");
  }

  if (i === correctIndex) {
    score++;
    correctSound.play();
  } else {
    wrongSound.play();
  }
}

nextBtn.onclick = () => {
  currentQ++;
  if (currentQ < questions.length) {
    loadQuestion();
  } else {
    showScore();
  }
};

// Timer
function resetTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerEl.innerText = `⏱ ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `⏱ ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);
      selectAnswer(-1);
    }
  }, 1000);
}

// Progress bar
function updateProgress() {
  const percent = (currentQ / questions.length) * 100;
  progress.style.width = percent + "%";
}

// Score + LocalStorage
function showScore() {
  questionEl.innerText = "Quiz Finished!";
  answersEl.innerHTML = "";
  nextBtn.style.display = "none";

  scoreEl.innerText = `Score: ${score}/${questions.length}`;

  let highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScore = score;
  }

  highScoreEl.innerText = `🏆 High Score: ${highScore}`;
}

// Dark mode
document.getElementById("darkToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// Start
loadQuestions();