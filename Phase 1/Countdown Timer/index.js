const day = document.querySelector('#day');
const hr  = document.querySelector('#hours');
const min = document.querySelector('#minutes');
const sec = document.querySelector('#sec');

const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#reset');

const initial = {
  d: Number(day.textContent) || 0,
  h: Number(hr.textContent)  || 0,
  m: Number(min.textContent) || 0,
  s: Number(sec.textContent) || 0,
};

let timerId = null;

function pad2(n) { return String(n).padStart(2, '0'); }

function render({ d, h, m, s }) {
  day.textContent = pad2(d);
  hr.textContent  = pad2(h);
  min.textContent = pad2(m);
  sec.textContent = pad2(s);
}

function getCurrentValues() {
  const d = Number(day.textContent) || 0;
  const h = Number(hr.textContent)  || 0;
  const m = Number(min.textContent) || 0;
  const s = Number(sec.textContent) || 0;
  return { d, h, m, s };
}

function computeTargetTime({ d, h, m, s }) {
  const totalSeconds = d * 86400 + h * 3600 + m * 60 + s;
  return Date.now() + totalSeconds * 1000;
}

function startCountdown() {
  const inputs = getCurrentValues();
  const targetTime = computeTargetTime(inputs);


  render(inputs);

  timerId = setInterval(() => {
    const remaining = targetTime - Date.now();

    if (remaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      render({ d: 0, h: 0, m: 0, s: 0 });
      return;
    }

    const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const m = Math.floor((remaining / (1000 * 60)) % 60);
    const s = Math.floor((remaining / 1000) % 60);

    render({ d, h, m, s });
  }, 1000);
}

// Start
startBtn.addEventListener('click', () => {
  if (timerId) return; 
  const { d, h, m, s } = getCurrentValues();
  if (d + h + m + s === 0) return;
  startCountdown();
});

// Reset
resetBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  render(initial);
});