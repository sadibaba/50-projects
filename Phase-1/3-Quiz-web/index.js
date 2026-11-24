const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");
const counterEl = document.querySelector("#counter");
const scoreEl = document.querySelector("#score");
const progressEl = document.querySelector("#progress");
const statusEl = document.querySelector("#status");
const nextButton = document.querySelector("#next");
const restartButton = document.querySelector("#restart");

const TOTAL_QUESTIONS = 10;

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const decodeHTML = (value) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

function shuffle(items) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
}

function setStatus(message, tone = "neutral") {
  statusEl.textContent = message;
  statusEl.className = `mt-6 min-h-6 text-sm ${
    tone === "error" ? "text-rose-300" : tone === "success" ? "text-emerald-300" : "text-white/70"
  }`;
}

function updateHeader() {
  counterEl.textContent = `Question ${Math.min(currentIndex + 1, TOTAL_QUESTIONS)} of ${TOTAL_QUESTIONS}`;
  scoreEl.textContent = `Score: ${score}`;
  progressEl.style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;
}

function showQuestion() {
  const current = questions[currentIndex];
  answered = false;
  nextButton.disabled = true;

  questionEl.textContent = decodeHTML(current.question);
  optionsEl.innerHTML = "";

  const answers = shuffle([
    ...current.incorrect_answers.map(decodeHTML),
    decodeHTML(current.correct_answer),
  ]);

  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.className =
      "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium transition hover:border-emerald-400/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400";
    button.addEventListener("click", () => checkAnswer(button, answer, decodeHTML(current.correct_answer)));
    optionsEl.appendChild(button);
  });

  updateHeader();
}

function checkAnswer(button, selected, correct) {
  if (answered) return;
  answered = true;
  nextButton.disabled = false;

  const buttons = [...optionsEl.querySelectorAll("button")];
  buttons.forEach((option) => {
    option.disabled = true;
    if (option.textContent === correct) {
      option.className =
        "rounded-xl border border-emerald-400/60 bg-emerald-500/20 px-4 py-3 text-left text-sm font-medium text-emerald-100";
    }
  });

  if (selected === correct) {
    score += 1;
    setStatus("Correct.", "success");
  } else {
    button.className =
      "rounded-xl border border-rose-400/60 bg-rose-500/20 px-4 py-3 text-left text-sm font-medium text-rose-100";
    setStatus(`Not quite. The answer is ${correct}.`, "error");
  }

  scoreEl.textContent = `Score: ${score}`;
  progressEl.style.width = `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`;
}

function finishQuiz() {
  questionEl.textContent = "Quiz complete";
  optionsEl.innerHTML = "";
  counterEl.textContent = `Question ${TOTAL_QUESTIONS} of ${TOTAL_QUESTIONS}`;
  progressEl.style.width = "100%";
  setStatus(`You scored ${score} out of ${TOTAL_QUESTIONS}.`, "success");
  nextButton.classList.add("hidden");
  restartButton.classList.remove("hidden");
}

nextButton.addEventListener("click", () => {
  if (!answered) return;
  currentIndex += 1;
  if (currentIndex >= questions.length) {
    finishQuiz();
    return;
  }
  setStatus("");
  showQuestion();
});

restartButton.addEventListener("click", () => {
  nextButton.classList.remove("hidden");
  restartButton.classList.add("hidden");
  loadQuiz();
});

async function loadQuiz() {
  setStatus("Loading questions...");
  questionEl.textContent = "";
  optionsEl.innerHTML = "";
  nextButton.disabled = true;
  nextButton.classList.remove("hidden");
  restartButton.classList.add("hidden");
  restartButton.textContent = "Play again";
  score = 0;
  currentIndex = 0;
  updateHeader();

  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${TOTAL_QUESTIONS}&category=15&type=multiple`
    );
    if (!response.ok) throw new Error("The quiz service did not respond.");

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error("No questions are available right now.");
    }

    questions = data.results;
    setStatus("");
    showQuestion();
  } catch (error) {
    setStatus(`${error.message} Check your connection and try again.`, "error");
    restartButton.classList.remove("hidden");
    restartButton.textContent = "Retry";
  }
}

loadQuiz();
