const daysEl = document.querySelector("#days");
const hoursEl = document.querySelector("#hours");
const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");
const targetInput = document.querySelector("#target");
const startButton = document.querySelector("#start");
const resetButton = document.querySelector("#reset");
const statusEl = document.querySelector("#status");

const STORAGE_KEY = "countdown-target";
const DEFAULT_HOURS = 24;

let targetTime = null;
let intervalId = null;

const pad = (value) => String(Math.max(value, 0)).padStart(2, "0");

function toLocalInputValue(date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function setStatus(message) {
  statusEl.textContent = message;
}

function render(totalMs) {
  if (totalMs <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  daysEl.textContent = pad(Math.floor(totalSeconds / 86400));
  hoursEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  secondsEl.textContent = pad(totalSeconds % 60);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function tick() {
  if (!targetTime) return;

  const remaining = targetTime - Date.now();
  render(remaining);

  if (remaining <= 0) {
    stopTimer();
    startButton.textContent = "Start countdown";
    setStatus("The countdown has finished.");
    localStorage.removeItem(STORAGE_KEY);
  }
}

function startTimer() {
  const value = targetInput.value;
  if (!value) {
    setStatus("Choose a target date and time first.");
    return;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    setStatus("That date is not valid.");
    return;
  }

  if (parsed.getTime() <= Date.now()) {
    setStatus("Choose a date in the future.");
    return;
  }

  targetTime = parsed.getTime();
  localStorage.setItem(STORAGE_KEY, new Date(targetTime).toISOString());

  stopTimer();
  tick();
  intervalId = setInterval(tick, 1000);
  startButton.textContent = "Restart countdown";
  setStatus(`Counting down to ${parsed.toLocaleString()}.`);
}

function resetTimer() {
  stopTimer();
  targetTime = null;
  localStorage.removeItem(STORAGE_KEY);
  render(0);
  targetInput.value = "";
  startButton.textContent = "Start countdown";
  setStatus("Set a target and press start.");
}

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const hours = Number(button.dataset.preset);
    const target = new Date(Date.now() + hours * 3600_000);
    targetInput.value = toLocalInputValue(target);
    startTimer();
  });
});

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  const parsed = new Date(saved);
  if (!Number.isNaN(parsed.getTime()) && parsed.getTime() > Date.now()) {
    targetInput.value = toLocalInputValue(parsed);
    targetTime = parsed.getTime();
    tick();
    intervalId = setInterval(tick, 1000);
    startButton.textContent = "Restart countdown";
    setStatus(`Resuming the countdown to ${parsed.toLocaleString()}.`);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

if (!targetInput.value) {
  const fallback = new Date(Date.now() + DEFAULT_HOURS * 3600_000);
  targetInput.value = toLocalInputValue(fallback);
  render(fallback.getTime() - Date.now());
}
