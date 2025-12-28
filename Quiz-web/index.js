const questionEl = document.querySelector('.Question');
const optionButtons = document.querySelectorAll('.options button');
const counterEl = document.querySelector('.counter');

let questions = [];
let currentIndex = 0;

async function loadQuestion() {
  const res = await fetch('https://opentdb.com/api.php?amount=50&category=15&type=multiple');
  const data = await res.json();
  questions = data.results;
  showQuestions();
}

function showQuestions() {
  const currentQ = questions[currentIndex];

  // Question text
  questionEl.textContent = currentQ.question;

  // Mix correct + incorrect answers
  const answers = [...currentQ.incorrect_answers, currentQ.correct_answer];
  shuffleArray(answers);

  // Render options
  optionButtons.forEach((btn, i) => {
    btn.textContent = answers[i];
    btn.onclick = () => checkAnswer(answers[i], currentQ.correct_answer);
  });

  // Counter update
  counterEl.textContent = `${currentIndex + 1}/${questions.length}`;
}

function checkAnswer(selected, correctAnswer) {
  if (selected === correctAnswer) {
    alert('Corrected buddy!');
    nextQuestion();
  } else {
    alert('ops sorry buddy');
  }
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestions();
  } else {
    questionEl.textContent = 'Quiz Finished!';
    optionButtons.forEach(btn => btn.style.display = 'none');
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadQuestion();